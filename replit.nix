{ pkgs }: {
	deps = [
		pkgs.nodejs-20_x
		pkgs.nodePackages.typescript-language-server
		pkgs.libuuid
		pkgs.replitPackages.jest
        # Playwright & Browser Dependencies
        pkgs.chromium
        pkgs.nss
        pkgs.freetype
        pkgs.fontconfig
        pkgs.glib
        pkgs.gtk3
        pkgs.alsa-lib
        pkgs.at-spi2-atk
        pkgs.at-spi2-core
        pkgs.dbus
        pkgs.expat
        pkgs.libdrm
        pkgs.libxcb
        pkgs.libxkbcommon
        pkgs.mesa
        pkgs.nspr
        pkgs.pango
        pkgs.systemd
        pkgs.xorg.libX11
        pkgs.xorg.libXcomposite
        pkgs.xorg.libXcursor
        pkgs.xorg.libXdamage
        pkgs.xorg.libXext
        pkgs.xorg.libXfixes
        pkgs.xorg.libXi
        pkgs.xorg.libXrandr
        pkgs.xorg.libXrender
        pkgs.xorg.libXScrnSaver
        pkgs.xorg.libXtst
	];
	env = {
		LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
			pkgs.libuuid
            pkgs.nss
            pkgs.glib
            pkgs.gtk3
		];
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1"; 
        # We use system chromium in Replit to save space
	};
}
