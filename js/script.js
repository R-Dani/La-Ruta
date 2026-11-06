fetch("sidebar.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("sidebar-container").innerHTML = data;

        document.getElementById("sidebarCollapse")
            .addEventListener("click", function () {

                document.getElementById("sidebar")
                    .classList.toggle("active");

            });

    });
