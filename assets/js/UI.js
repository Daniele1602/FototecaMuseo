let Init = function () {
    let url = Defaults.BaseInfoURL + "Dati/Album/14";
    Utilities.Ajax.ExecuteAjax(url, CreateUI);
    url = Defaults.BaseInfoURL + "Album";
    Utilities.Ajax.ExecuteAjax(url, (results) => {
        var select = $("#album")
        var template = "<option value=\"{0}\">Album ID {0}</option>";
        var options = "";
        results.forEach((elem) => {
            options += template.replace(/\{0}/g, elem.id_album)
        })
        select.append(options)
        select.on("change", () => {
            if ($("#advancedResearchForm").is(":hidden"))
                UpdateImages(select.attr("id"))
        })
    });
    $("#string").on("change", () => {
        if ($("#advancedResearchForm").is(":hidden"))
            UpdateImages($("#string").attr("id"))
    });
    let form = $("#advancedResearchForm");
    form.hide();
    $(window).click(ShowResearch);
}

let CreateUI = function (data) {
    if (data !== undefined && data !== null && data.length > 0) {
        var section = $("#thumbnails");
        section.children().remove();
        var template = String($("#templateIndex").html());
        data.forEach((foto) => {
            let URL = Defaults.BaseImgURL + foto.file_path
            let image = template.replace(/\{0}/g, URL);
            image = image.replace(/\{1}/g, foto.codice)
            section.append(image);
        })
        let viewer = $("div#viewer");
        viewer.remove();
        main.slides = []
        main.current = null;
        main.init(false);
    } else {
        ShowError("Non sono stati trovati elementi corrispondenti");
    }
}

let UpdateImages = function (callerID) {
    let url = Defaults.BaseInfoURL;
    if (callerID === "string" && $("#" + callerID).val() !== "") {
        url += "Dati/All/Contiene/" + $("#" + callerID).val();
        console.log(url)
    }
    else if (callerID === "album") {
        url += "Dati/Album/" + $("#" + callerID).val();
    }
    else {
        url += "Dati/Album/14";
    }
    Utilities.Ajax.ExecuteAjax(url, CreateUI);
}

let ShowInfo = function (code) {
    let info = $("#info")
    if (!info.hasClass("shown")) {
        Utilities.Ajax.ExecuteAjax(Defaults.BaseInfoURL + "Dati/Codice/" + code, (data) => {
            data = data[0];
            info.empty();
            info.append("<p class=\"th\"><u>Titolo</u>:</p>");
            info.append("<p class=\"td\">" + data.soggetto_titolo.replace(/\[/g, "").replace(/\]/g, "") + "</p>");
            info.append("<p class=\"th\"><u>Album ID</u>:</p>");
            info.append("<p class=\"td\">" + data.id_album + "</p>");
            info.append("<p class=\"th\"><u>Soggetto</u>:</p>");
            info.append("<p class=\"td\">" + data.soggetto + "</p>");
            info.append("<p class=\"th\"><u>Data</u>:</p>");
            info.append("<p class=\"td\">" + data.data_esecuz_da + "</p>");
            info.append("<p class=\"th\"><u>Fondo di provenienza</u>:</p>");
            info.append("<p class=\"td\">" + data.fondo_provenienza + "<br/>" + "</p>");
            info.append("<p class=\"th\"><u>Luogo del fondo</u>:</p>");
            info.append("<p class=\"td\">" + data.fondo_provenienza_luogo + "</p>");
            info.addClass("shown");
            info.on('transitionend webkitTransitionEnd oTransitionEnd', () => {
                $(window).click((event) => {
                    if ($(event.target).parents("#info").length === 0 &&
                        !($(event.target).attr('id') === "info")) {
                        //$(window).unbind(ShowInfo);
                        info.removeClass("shown");
                    }
                })
            });
        });
    }
}

let ShowError = function (text) {
    $("#errorText").text(text)
    $("#errorMessage").slideDown(300, () => {
        window.setTimeout(() => {
            $("#errorMessage").slideUp(300);
            window.clearTimeout();
        }, 3000);
    })
}

let AdvancedResearch = function () {
    let titolo = $("#titolo").val();
    let intestazione = $("#intestazione").val();
    let date = [$("#date1").val(), $("#date2").val()];
    let album = $("#includeAlbum").is(":checked");
    let key = $("#includeKey").is(":checked");

    let empty = titolo === "" && intestazione === "" && date[0] === "" &&
        date[1] === "" && !album && !key;

    if (empty) {
        ShowError("Inserire almeno un parametro");
    }
    else {
        let data = Utilities.Buffer();
        let url = Defaults.BaseInfoURL;
        if (date[0] !== "") {
            if (date[1] !== "") {
                let dataMin = new Date(date[0]).getTime < new Date(date[1]).getTime() ? date[0] : date[1];
                let dataMax = new Date(date[0]).getTime > new Date(date[1]).getTime() ? date[0] : date[1];
                url += "Dati/Data/BW/" + dataMin + "/" + dataMax;
            }
            else {
                url += "Dati/Data/EQ/" + date[0];
            }
            date = null;
        }
        else if (date[1] !== "") {
            url += "Dati/Data/EQ/" + date[1];
            date = null;
        }
        else if (titolo !== "") {
            url += "Dati/Titolo/Contiene/" + titolo;
            titolo = null;
        }
        else if (intestazione !== "") {
            url += "Dati/Intestazione/Contiene/" + intestazione;
            intestazione = null;
        }
        else if (key) {
            key = $("#string").val();
            url += "Dati/All/Contiene/" + key
            key = null;
        }
        else {
            url += "Dati/Album/" + $("#album").val();
            album = null;
        }
        Utilities.Ajax.ExecuteAjax(url, (result) => {
            titolo = titolo !== null ? titolo.toUpperCase() : "";
            intestazione = intestazione !== null ? intestazione.toUpperCase() : "";
            let id = $("#album").val();
            let keyString = key !== null && key ? $("#string").val().toUpperCase() : "";
            result.forEach((elem) => {
                let condizione = true;
                if (titolo !== "") {
                    condizione &= elem.soggetto_titolo.toUpperCase().indexOf(titolo) >= 0;
                }

                if (condizione && intestazione !== "") {
                    condizione &= elem.intestazione.toUpperCase().indexOf(intestazione) >= 0;
                }

                if (condizione && album !== null && album) {
                    condizione &= elem.id_album === id;
                }

                if (condizione && keyString !== "") {
                    condizione &= elem.soggetto.toUpperCase().indexOf(keyString) >= 0;
                    if (condizione && titolo !== "") {
                        condizione &= elem.soggetto_titolo.toUpperCase().indexOf(titolo) >= 0;
                    }
                    if (condizione && intestazione !== "") {
                        condizione &= elem.intestazione.toUpperCase().indexOf(intestazione) >= 0;
                    }
                }

                if (condizione) {
                    data.Push(elem);
                }
            });
            CreateUI(data.Data(true));
        });

        $('#advancedResearchForm').slideUp(300);
    }

    ResetAdvancedResearchForm();
}

let ChangeTheme = function (lightTheme) {
    let changeTheme = $('html').get(0).style;
    if (lightTheme) {
        changeTheme.setProperty('--bg--color', "rgba(247, 247, 247, 0.925)");
        changeTheme.setProperty('--txt--color', "rgb(8, 8, 8)");
        $("#icon > img").attr("src", "assets/Images/info-icon-light-theme.png");
        $("#errorMessage").css("background-color", "red");
        $("#changeTheme").text("Imposta tema scuro")
    }
    else {
        changeTheme.setProperty('--bg--color', "rgba(8, 8, 8, 0.925)");
        changeTheme.setProperty('--txt--color', "rgb(247, 247, 247)");
        $("#icon > img").attr("src", "assets/Images/info-icon.png");
        $("#errorMessage").css("background-color", "#800000");
        $("#changeTheme").text("Imposta tema chiaro")
    }
}

let ResetAdvancedResearchForm = function () {
    $("#titolo").val("");
    $("#intestazione").val("");
    $("#date1").val("");
    $("#date2").val("");
    $('#advancedResearchForm > .switch > input').prop('checked', false);
}

let ShowResearch = function(event) {
    let form = $("#advancedResearchForm");
    if ($(event.target).parents('#advancedResearchForm').length === 0 &&
        $(event.target).attr('id') !== 'advancedResearchForm' &&
        $(event.target).attr('id') !== 'advancedResearch') {
        form.slideUp(300);
    }
}