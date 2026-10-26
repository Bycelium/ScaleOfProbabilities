{
  description = "The Scale of Probability development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default =
            assert pkgs.lib.hasPrefix "24." pkgs.nodejs_24.version;
            assert pkgs.pnpm.version == "11.20.0";
            pkgs.mkShell {
              packages = [ pkgs.nodejs_24 pkgs.pnpm ];
            };
        });
    };
}
