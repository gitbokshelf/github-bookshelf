(() => {
        let preference;
        try { preference = localStorage.getItem("bookshelf:theme"); } catch {}
        const theme = preference === "light" || preference === "dark"
          ? preference
          : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#f7f6f0" : "#111311";
      })();
