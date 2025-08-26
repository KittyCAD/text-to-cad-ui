{
  description = "text-to-cad-ui development environment";

  # Flake inputs
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  # Flake outputs
  outputs = {
    self,
    nixpkgs,
  }: let
    # Overlays enable you to customize the Nixpkgs attribute set
    # Systems supported
    allSystems = [
      "x86_64-linux" # 64-bit Intel/AMD Linux
      "aarch64-linux" # 64-bit ARM Linux
      "x86_64-darwin" # 64-bit Intel macOS
      "aarch64-darwin" # 64-bit ARM macOS
    ];

    # Helper to provide system-specific attributes
    forAllSystems = f:
      nixpkgs.lib.genAttrs allSystems (
        system:
          f {
            pkgs = import nixpkgs {
              inherit system;
              config.allowBroken = true;
            };
          }
      );
  in {
    # Development environment output
    devShells = forAllSystems (
      {pkgs}: {
        default = pkgs.mkShell {
          # The Nix packages provided in the environment
          packages =
            (with pkgs; [
              just
              nodejs
              openssl
              pkg-config
            ])
            ++ pkgs.lib.optionals pkgs.stdenv.isDarwin (
              with pkgs; [
                libiconv
              ]
            );
        };
      }
    );
  };
}
