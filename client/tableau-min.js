window.tableau = window.tableau || {},
    function() {
        function n(n) { for (var t, r, u = document.getElementsByTagName("script"), i = 0; i < u.length; i++)
                if (t = u[i].src, t.search(n) > 0 && (r = t.lastIndexOf("/"), r >= 0)) return t.substring(0, r + 1);
            return "" }

        function t(n) { document.write('<script src="' + n + '"><\/script>') }
        window.tableau._apiLoaded || (window.tableau._apiLoaded = !0, t(n("tableau-2.min.js") + "tableau-2.2.1.min.js")) }();