import type { Models } from '@kittycad/lib/types'
import { env } from '$lib/env'

/**
 * Adapted from https://github.com/KittyCAD/modeling-app/blob/49d40f28b703505743f90948a38ede929d4f28e0/src/lib/crossPlatformFetch.ts
 */

const headers = (token?: string): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
})

export enum EBillingError {
  NotOk,
  UnexpectedStatus,
  CatastrophicRequest,
  JSONParse,
}

export interface IBillingErrorNotOk  {
  type: EBillingError.NotOk,
  data: string,
  response: Response,
  message: string,
}

export interface IBillingErrorUnexpectedStatus  {
  type: EBillingError.UnexpectedStatus,
  code: number,
}

export interface IBillingErrorCatastrophicRequest {
  type: EBillingError.CatastrophicRequest,
  url: string,
}

export interface IBillingErrorJSONParse {
  type: EBillingError.JSONParse,
  error: Error,
}

export type _IBillingError = (IBillingErrorNotOk | IBillingErrorUnexpectedStatus | IBillingErrorCatastrophicRequest | IBillingErrorJSONParse)
export type IBillingError =  _IBillingError extends { type: EBillingError } ? _IBillingError : never

export class BillingError {
  constructor(public error: IBillingError) {}

  static from(v: any): v is BillingError {
    return typeof v === 'object' && 'error' in v && 'type' in v.error && Object.values(EBillingError).some(x => x === v.error.type)
  }
}

async function fetchBilling<T>(
  url: string,
  options?: RequestInit,
  token?: string
): Promise<T | BillingError> {
  let response = null
  const opts = options || {}
  opts.headers = headers(token)
  opts.credentials = 'include'

  try {
    response = await fetch(url, opts)
  } catch (e) { }

  if (response === null) {
    return new BillingError({
      type: EBillingError.CatastrophicRequest,
      url,
    })
  }

  const data = (await response.json().catch((e) => e)) as T | Error

  if (!response.ok) {
    const fallbackErrorMessage = `Failed to request endpoint: ${url} with status: ${response.status} ${response.statusText}`
    const resolvedMessage =
      data instanceof Object && 'message' in data ? data.message : fallbackErrorMessage
    return new BillingError({
      type: EBillingError.NotOk,
      response,
      data: JSON.stringify(data),
      message: resolvedMessage,
    })
  }

  if (data instanceof Error) {
    return new BillingError({
      type: EBillingError.JSONParse,
      error: data,
    })
  }

  if (typeof data === 'number') {
    return new BillingError({
      type: EBillingError.UnexpectedStatus,
      code: Number(data),
    })
  }

  return data
}

export enum Tier {
  Free = 'free',
  Pro = 'pro',
  Organization = 'organization',
  Unknown = 'unknown'
}

type OrgOrError = Models['Org_type'] | BillingError
type SubscriptionsOrError = Models['ZooProductSubscriptions_type'] | BillingError
type TierBasedOn = {
  org: OrgOrError
  subscriptions: SubscriptionsOrError
}

const toTierFrom = (args: TierBasedOn): Tier => {
  if (!BillingError.from(args.org)) {
    return Tier.Organization
  } else if (!BillingError.from(args.subscriptions)) {
    if (args.subscriptions?.modeling_app?.name === 'pro') {
      return Tier.Pro
    } else {
      return Tier.Free
    }
  }

  return Tier.Unknown
}

/**
 * Adapted from https://github.com/KittyCAD/modeling-app/blob/49d40f28b703505743f90948a38ede929d4f28e0/src/machines/billingMachine.ts#L91
 */
export async function getBillingInfo(
  token: string
): Promise<BillingError | { credits: number; allowance?: number, tier: Tier }> {
  const billing = await fetchBilling<Models['CustomerBalance_type']>(
    `${env.VITE_API_BASE_URL}/user/payment/balance`,
    { method: 'GET' },
    token
  )

  if (BillingError.from(billing)) {
    return billing
  }

  const subscriptions = await fetchBilling<Models['ZooProductSubscriptions_type']>(
    `${env.VITE_API_BASE_URL}/user/payment/subscriptions`,
    { method: 'GET' },
    token
  )

  const org = await fetchBilling<Models['Org_type']>(
    `${env.VITE_API_BASE_URL}/org`,
    { method: 'GET' },
    token
  )

  const tier = toTierFrom({
    org,
    subscriptions,
  })

  let credits =
    Number(billing.monthly_api_credits_remaining) + Number(billing.stable_api_credits_remaining)
  let allowance = undefined

  switch (tier) {
    case Tier.Organization:
    case Tier.Pro:
      credits = Infinity
      break
    case Tier.Free:
      if (!BillingError.from(subscriptions)) {
        allowance = Number(subscriptions?.modeling_app?.monthly_pay_as_you_go_api_credits)
      }
      break
    case Tier.Unknown:
      break
  }

  return {
    tier,
    credits,
    allowance
  }
}
