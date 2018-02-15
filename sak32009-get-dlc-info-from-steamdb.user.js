// ==UserScript==
// @name             Get DLC Info from SteamDB
// @namespace        sak32009-get-dlc-info-from-steamdb
// @description      Get DLC Info from SteamDB.
// @author           Sak32009
// @contributor      CS.RIN.RU Users
// @version          3.5.4
// @license          MIT
// @homepageURL      https://github.com/Sak32009/GetDLCInfoFromSteamDB/
// @supportURL       http://cs.rin.ru/forum/viewtopic.php?f=10&t=71837
// @updateURL        https://github.com/Sak32009/GetDLCInfoFromSteamDB/raw/master/sak32009-get-dlc-info-from-steamdb.meta.js
// @downloadURL      https://github.com/Sak32009/GetDLCInfoFromSteamDB/raw/master/sak32009-get-dlc-info-from-steamdb.user.js
// @icon             https://raw.githubusercontent.com/Sak32009/GetDLCInfoFromSteamDB/master/sak32009-get-dlc-info-from-steamdb.png
// @match            *://steamdb.info/app/*
// @require          https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require          https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js
// @require          https://steamdb.info/static/js/tabbable.4f8f7fce.js
// @grant            none
// @run-at           document-end
// ==/UserScript==

((() => {

    // LINE BREAK
    const LineBreak = (str) => str.replace(/\n/g, "\r\n");

    // DOWNLOAD
    const Download = (str) => `data:text/plain;charset=utf-8,${encodeURIComponent(LineBreak(str))}`;

    // STORAGE
    const Storage = {

        // PREFIX
        prefix: `${GM_info.script.namespace}-`,

        // GET
        get(key) {
            return window.localStorage.getItem(this.prefix + key);
        },

        // SET
        set(key, value) {
            window.localStorage.setItem(this.prefix + key, value);
        },

        // REMOVE
        remove(key) {
            window.localStorage.removeItem(this.prefix + key);
        },

        // CLEAR
        clear() {
            window.localStorage.clear();
        },

        // IS VALID
        isValid(item) {
            return typeof item !== "undefined" && item !== null && item.length > 0;
        },

        // IS CHECKED
        isChecked(key) {
            return this.get(key) === "true";
        }

    };

    // MAIN
    const GetDLCInfofromSteamDB = {

        // FORMATS
        formats: {
            // CREAMAPI
            creamAPI: {
                name: "CREAMAPI v3.4.1.0",
                callback({info}, app){
                    return {
                        name: "cream_api.ini",
                        data: `[steam]
; Application ID (http://store.steampowered.com/app/%appid%/)
appid = [steamdb]appID[/steamdb]
; Current game language.
; Uncomment this option to turn it on.
; Default is "english".
;language = german
; Enable/disable automatic DLC unlock. Default option is set to "false".
; Keep in mind that this option is highly experimental and won't
; work if the game wants to call each DLC by index.
unlockall = false
; Original Valve's steam_api.dll.
; Default is "steam_api_o.dll".
orgapi = steam_api_o.dll
; Original Valve's steam_api64.dll.
; Default is "steam_api64_o.dll".
orgapi64 = steam_api64_o.dll
; Enable/disable extra protection bypasser.
; Default is "false".
extraprotection = false
; The game will think that you're offline (supported by some games).
; Default is "false".
forceoffline = false
; Some games are checking for the low violence presence.
; Default is "false".
;lowviolence = true
; Installation path for the game.
; Note, that you can use ..\\ to set the parent directory (from where executable file is located).
; Maximum number of parent directories: 5 (..\\..\\..\\..\\..\\)
; Default is the path to current working directory.
;installdir = ..\\
; Use DLC id as the appended installation directory.
; e.g. <install_directory>\\480
; Default is "true".
;dlcasinstalldir = false
; Purchase timestamp for the DLC (http://www.onlineconversion.com/unix_time.htm).
; Default is "0" (1970/01/01).
;purchasetimestamp = 0
; Turn on the wrapper mode.
; Default is "false".
wrappermode = false

[steam_misc]
; Disables the internal SteamUser interface handler.
; Does have an effect on the games that are using the license check for the DLC/application.
; Default is "false".
disableuserinterface = false
; Disables the internal SteamUtils interface handler.
; Does have an effect on the games that are checking for the actual AppId (only matters when "wrappermode" is set to "true").
; Default is "false".
disableutilsinterface = false
; Disable the internal reserve hook of the "Steam_RegisterInterfaceFuncs" function.
; Default is "false".
disableregisterinterfacefuncs = false
; Unlock/Lock Steam parental restrictions.
; Default is "true".
;unlockparentalrestrictions = false
; SteamId64 to override. Note that this action could be risky !
; This option can only work if "disableuserinterface = false".
;steamid = 0
; Bypass VAC signature check. Note that this action could be risky !
; Default is "false".
;signaturebypass = true

[steam_wrapper]
; Application ID to override (used when the wrapper mode is on)
newappid = 0
; Use the internal storage system.
; Default is "false".
wrapperremotestorage = false
; Use the internal stats/achievements system.
; Default is "false".
wrapperuserstats = false
; Use the internal workshop (UGC) system.
; Default is "false".
wrapperugc = false
; Store the data in the current directory (incl. stats)
; By default the data is stored at: %appdata%/CreamAPI/%appid%/
; Default is "false".
saveindirectory = false
; Force the usage of a full save path instead of the relative one.
; Default is "false".
forcefullsavepath = false
; Disable internal callbacks system.
; Default is "false".
;disablecallbacks = true
; Disable/Enable a StoreStats callback. Takes effect only if "wrapperuserstats" is set to "true".
; Default is "true".
;storestatscallback = false
; Fixed achievements count.
; Some games can only work if this option is configured properly (e.g. Wolfenstein II).
; Default is "0".
achievementscount = 0

[dlc]
; DLC handling.
; Format: <dlc_id> = <dlc_description>
; e.g. : 247295 = Saints Row IV - GAT V Pack
; If the DLC is not specified in this section
; then it won't be unlocked
[dlcs]{dlc_id} = {dlc_name}\n[/dlcs]
[dlc_installdirs]
; Installation path for the specific DLC (dependent from "installdir" option).
; This section works only if "dlcasinstalldir" option is set to "false".
; Format: <dlc_id> = <install_dir>
; e.g. : 556760 = DLCRoot0

[steam_ugc]
; Subscribed workshop items.
; This section works only if "wrappermode" and "wrapperugc" options are set to "true".
; Format: <dlc_id> = <true/false>
; e.g. : 812713531 = true
; Please refer to __README_WORKSHOP_EN__.txt for more details.`
                    };
                },
                options: {}
            },

			// CREAMAPI v3.0.0.3 Hotfix
            creamAPI_3_0_0_3_h: {
                name: "CREAMAPI v3.0.0.3 Hotfix",
                callback({info}, app){
                    return {
                        name: "cream_api.ini",
                        data: `[steam]
; Application ID (http://store.steampowered.com/app/%appid%/)
appid = [steamdb]appID[/steamdb]
; Force the usage of specific language.
; Uncomment this option to turn it on.
;language = german
; Enable/disable automatic DLC unlock. Default option is set to "false".
; Keep in mind that this option is highly experimental and won't
; work if the game wants to call each DLC by index.
unlockall = false
; Original Valve's steam_api.dll.
; Default is "steam_api_o.dll".
orgapi = steam_api_o.dll
; Original Valve's steam_api64.dll.
; Default is "steam_api64_o.dll".
orgapi64 = steam_api64_o.dll
; Enable/disable extra protection bypasser.
; Default is "false".
extraprotection = false
; This option will force the usage of the default Steam user data folder.
; Default is "true".
;forceuserdatafolder = false
; The game will think that you're offline (supported by some games).
; Default is "false".
forceoffline = false
; Some games are checking for the low violence presence.
; Default is "false".
;lowviolence = true
; Disables the internal SteamUser interface handler.
; Does have an effect on the games that are using the license check for the DLC/application.
; Default is "false".
disableuserinterface = false
; Disables the internal SteamUtils interface handler.
; Does have an effect on the games that are checking for the actual AppId (only matters when "wrappermode" is set to "true").
; Default is "false".
disableutilsinterface = false
; Turn on the wrapper mode.
; Default is "false".
wrappermode = false

[steam_wrapper]
; Application ID to override (used when the wrapper mode is on)
newappid = 0
; Use the internal storage system.
; Default is "false".
wrapperremotestorage = false
; Use the internal stats/achievements system.
; Default is "false".
wrapperuserstats = false
; Store the data in the current directory (incl. stats)
; By default the data will is stored at: %appdata%/CreamAPI/%appid%/
; Default is "false".
saveindirectory = false
; Disable/Enable a StoreStats callback. Takes effect only if "wrapperuserstats" is set to "true".
; Default is "true"
;storestatscallback = false

[dlc]
; DLC handling.
; Format: <dlc_id> = <dlc_description>
; e.g. : 247295 = Saints Row IV - GAT V Pack
; If the DLC is not specified in this section
; then it won't be unlocked
[dlcs]{dlc_id} = {dlc_name}\n[/dlcs]`
                    };
                },
                options: {}
            },

			// CREAMAPI v2.0.0.7
            creamAPI_2_0_0_7: {
                name: "CREAMAPI v2.0.0.7",
                callback({info}, app){
                    return {
                        name: "cream_api.ini",
                        data: `[steam]
; Application ID (http://store.steampowered.com/app/%appid%/)
appid = [steamdb]appID[/steamdb]
; Force the usage of specific language.
; Uncomment this option to turn it on.
;language = german
; Enable/disable automatic DLC unlock. Default option is set to "false".
; Keep in mind that this option is highly experimental and won't
; work if game wants to call each DLC by index.
unlockall = false
; Original Valve's steam_api.dll.
; Default is "steam_api_o.dll".
orgapi = steam_api_o.dll
; Original Valve's steam_api64.dll.
; Default is "steam_api64_o.dll".
orgapi64 = steam_api64_o.dll
; Enable/disable extra protection bypasser.
; Default is "false".
extraprotection = false
; ExtraProtection level.
; Default is "0".
; Available options :
; 0 = minimum, 1 = medium, 2 = maximum
extraprotectionlevel = 0
; Turn on the "light" wrapper mode.
; Default is "false".
wrappermode = false
; Enable/disable logging of the DLC functions.
; Default is "false".
; If you use log_build, uncomment this option to turn it on.
;log = false

[steam_wrapper]
; Application ID to override (used when the wrapper mode is on)
newappid = 0
; Load steam emulator library.
; Default is "false".
loademu = false
; Emulator library that is used for the stats
; and storage handling.
; Default is "emu.dll".
emudll = emu.dll
; Use the emulator storage system.
; Default is "false".
wrapperremotestorage = false
; Use the emulator stats/achievements system.
; Default is "false".
wrapperuserstats = false
; Use the emulator utils system.
; Default is "false".
wrapperutils = false
; User the emulator callbacks system.
; Default is "false".
wrappercallbacks = false

[dlc_subscription]
; This will check if the specifed
; DLC is owned by the user.
; Format: <dlc_id> = <true/false>
; e.g. : 12345 = true
;        12346 = true
;        12347 = true
; If the DLC is not specified in this section
; then it won't be subscribed.
; Also if the value is set to "false" the DLC
; won't be subscribed either.
[dlcs]{dlc_id} = true\n[/dlcs]
[dlc_index]
; DLC handling.
; Format: <dlc_index> = <dlc_id>
; e.g. : 0 = 12345
;        1 = 12346
;        2 = 12347
[dlcs]{dlc_index} = {dlc_id}\n[/dlcs]
[dlc_names]
; Names for the DLCs index put above.
; Use this only if needed.
; Format: <dlc_index> = <dlc_name>
; e.g. : 0 = DLC Name 0
;        1 = DLC Name 1
;        2 = DLC Name 2
[dlcs]{dlc_index} = {dlc_name}\n[/dlcs]
[dlc_timestamp]
; Specifies a unique unix timestamp for the purchased DLC (http://www.onlineconversion.com/unix_time.htm).
; By default returns the current date timestamp (if nothing was specified).
; Format: <dlc_id> = <timestamp>
; e.g. : 12345 = 1420070400`
                    };
                },
                options: {}
            },

            // CREAMAPI MANUAL
            creamAPI_manual_mode: {
                name: "CreamAPI [MANUAL MODE]",
                callback({info}, app) {

                    // INI
                    let ini = info;
                    let txt = $("#GetDLCInfofromSteamDB_textarea");

                    if(txt.css("display") !== "none"){
                        if(txt.length > 0 ){

                            ini += txt.val();
                            ini = ini.replace(/appid = (\w+)/g, `appid = ${app.steamDB.appID}`);
                            ini = ini.replace(/\[dlc\]/g, `[dlc]\n${app.dlcList(`{dlc_id} = {dlc_name}\n`)}`);

                            // GENERATE
                            saveAs(new File([LineBreak(ini)], `cream_api.ini`, {
                                type: "application/octet-stream;charset=utf-8"
                            }));

                        }else{
                            window.alert("No content!");
                        }
                    }else{
                        window.alert("CTRL+C and CTRL+V content of cream_api.ini to textarea!");
                        txt.show().scrollTop(0).val("CTRL+V");
                    }

                },
                options: {}
            },

            // GREENLUMA BATCH MODE
            greenluma_batch_mode: {
                name: "GreenLuma [BATCH MODE]",
                callback({info}, app) {

                    // BATCH
                    let batch = info.replace(/; /g, ":: ");
                    batch += `@echo off
TITLE ${app.steamDB.appIDName} - ${app.info.name} by ${app.info.author} v${app.info.version}
CLS

:: CHECK APPLIST DIR
IF EXIST .\\AppList\\NUL (
    RMDIR /S /Q .\\AppList\\
)
:: CREATE APPLIST DIR
MKDIR .\\AppList\\
:: CREATE DLCS FILES
:: ${app.steamDB.appIDName}
ECHO ${app.steamDB.appID}> .\\AppList\\0.txt
${app.dlcList(`:: {dlc_name}
ECHO {dlc_id}> .\\AppList\\{dlc_index}.txt\n`, true)}`;

                    // GENERATE
                    saveAs(new File([LineBreak(batch)], `${app.steamDB.appIDName}_AppList.bat`, {
                        type: "application/octet-stream;charset=utf-8"
                    }));

                },
                options: {}
            },

            // LUMAEMU (ONLY DLCs LIST)
            lumaemu_only_dlcs: {
                name: "LUMAEMU v1.9.7 (ONLY DLCs LIST)",
                callback({info}, app) {
                    return {
                        name: "LumaEmu_only_dlcs.ini",
                        data: "[dlcs]; {dlc_name}\nDLC_{dlc_id} = 1\n[/dlcs]"
                    };
                },
                options: {}
            },

            // SMARTSTEAMEMU (ONLY DLCs LIST)
            smartsteamemu_only_dlcs: {
                name: "SMARTSTEAMEMU (ONLY DLCs LIST)",
                callback({info}, app) {
                    return {
                        name: "SmartSteamEmu_only_dlcs.ini",
                        data: "[dlcs]{dlc_id} = {dlc_name}\n[/dlcs]"
                    };
                },
                options: {}
            },

            // CODEX (ID = NAME)
            codex: {
                name: "CODEX (ID = NAME)",
                callback({info}, app) {
                    return {
                        name: "steam_emu.ini",
                        data: "[dlcs]{dlc_id} = {dlc_name}\n[/dlcs]"
                    };
                },
                options: {}
            },

            // CODEX (DLC00000, DLCName)
            codex_t: {
                name: "CODEX (DLC00000, DLCName)",
                callback({info}, app) {
                    return {
                        name: "steam_emu.ini",
                        data: "[dlcs=false:5]DLC{dlc_index} = {dlc_id}\nDLCName{dlc_index} = {dlc_name}\n[/dlcs]"
                    };
                },
                options: {}
            },

            // 3DMGAME
            "3dmgame": {
                name: "3DMGAME",
                callback({info}, app) {
                    return {
                        name: "3DMGAME.ini",
                        data: "[dlcs=true:3]; {dlc_name}\nDLC{dlc_index} = {dlc_id}\n[/dlcs]"
                    };
                },
                options: {}
            },

            // ALI213
            ali213: {
                name: "ALI213",
                callback({info}, app) {
                    return {
                        name: "ALI213.ini",
                        data: "[dlcs]{dlc_id} = {dlc_name}\n[/dlcs]"
                    };
                },
                options: {}
            },

            // SKIDROW
            skidrow: {
                name: "SKIDROW",
                callback({info}, app) {
                    return {
                        name: "steam_api.ini",
                        data: "[dlcs]; {dlc_name}\n{dlc_id}\n[/dlcs]"
                    };
                },
                options: {}
            },

            // SST311212
            SST311212: {
                name: "SST311212",
                callback({info}, app) {
                    return {
                        name: "SST311212.ini",
                        data: "[dlcs]{dlc_id} = {dlc_name}\n[/dlcs]"
                    };
                },
                options: {}
            }
        },

        // INFO
        info: {
            // AUTHOR
            author: "Sak32009",
            // NAME
            name: GM_info.script.name,
            // VERSION
            version: GM_info.script.version,
            // STEAMDB URL
            steamDB: "https://steamdb.info/app/",
            // HOMEPAGE URL
            homepage: "https://github.com/Sak32009/GetDLCInfoFromSteamDB/",
            // SUPPORT URL
            support: "http://cs.rin.ru/forum/viewtopic.php?f=10&t=71837"
        },

        // STEAMDB
        steamDB: {
            // APPID
            appID: "",
            // APPID NAME
            appIDName: "",
            // APPID DLCS
            appIDDLCs: {},
            // APPID TOTAL DLCS
            appIDDLCsCount: 0
        },

        // OPTIONS
        options: {
            globalSaveLastSelectionAndAutoSubmit: {
                title: "Save the last selected format and submit form when you open the page",
                type: "checkbox"
            },
            globalAutoDownload: {
                title: "Automatically download file .INI",
                type: "checkbox"
            },
            globalIgnoreSteamDBUnknownApp: {
                title: "Ignore DLCs 'SteamDB Unknown App'",
                type: "checkbox"
            }
        },

        // RUN
        run() {

            // CHECK IF THE APPID HAS DLCs
            const $check = $(".tab-pane#dlc .app[data-appid]");

            if ($check.length > 0) {

                // GET DATA
                this.getData();
                // CREATE DOM
                this.createDOM();
                // CREATE FORMATS
                this.createFormats();
                // CREATE GLOBAL OPTIONS TAB
                this.createTab("globalOptions", "Global Options", this.options);
                // LOAD OPTIONS
                this.loadOptions();
                // LOAD EVENTS
                this.loadEvents();

            }

        },

        // GET DATA
        getData() {

            // SET APPID
            this.steamDB.appID = $(".scope-app[data-appid]").data("appid");
            // SET APPID NAME
            this.steamDB.appIDName = $("td[itemprop='name']").text().trim();

            // SET APPID DLCs
            $(".tab-pane#dlc .app[data-appid]").each((_index, dom) => {

                const $this = $(dom);
                const appID = $this.data("appid");
                const appIDName = $this.find("td:nth-of-type(2)").text().trim();
                const appIDTime = $this.find("td:nth-of-type(3)").data("sort");
                const appIDDate = new Date(appIDTime * 1000).toUTCString();

                this.steamDB.appIDDLCs[appID] = {
                    name: appIDName,
                    timestamp: appIDTime,
                    date: appIDDate
                };

                this.steamDB.appIDDLCsCount += 1;

            });

        },

        // CREATE DOM
        createDOM() {

            // STYLE
            $("<style>").text(`.GetDLCInfofromSteamDB_tabNav img{width:16px;height:16px;margin-top:-4px}
#dlc > h2{display:none}`).appendTo("head");

            // HEADER
            $(`<div id='GetDLCInfofromSteamDB_header' style='margin-bottom:10px'>
    <form id='GetDLCInfofromSteamDB_submit'>
        <select id='GetDLCInfofromSteamDB_select'></select>
        <button type='submit' class='btn btn-primary'><i class='octicon octicon-clippy'></i> Get DLCs List</button>
        <span style='float:right'>
            <a href='javascript:;' class='btn' id='GetDLCInfofromSteamDB_downloadFile'><i class='octicon octicon-file-symlink-file'></i> Download File</a>
            <button type='button' class='btn btn-danger' id='GetDLCInfofromSteamDB_resetOptions'><i class='octicon octicon-trashcan'></i> Reset Options</button>
        </span>
    </form>
</div>`).insertAfter("#dlc > h2");

            // TEXTAREA
            $("<textarea id='GetDLCInfofromSteamDB_textarea' rows='20' style='margin-bottom:10px;width:100%;display:none'></textarea>").insertAfter("#GetDLCInfofromSteamDB_header");

        },

        // CREATE FORMATS
        createFormats() {

            // EACH
            $.each(this.formats, (index, values) => {

                const name = values.name;
                const options = values.options;

                // ADD OPTION
                const tag = $("<option>").attr("value", index).text(name);

                // ..... SAVE LAST SELECTION
                if (Storage.isChecked("globalSaveLastSelectionAndAutoSubmit") && Storage.get("globalSaveLastSelectionValue") === index) {
                    tag.prop("selected", true);
                }
                // .....

                tag.appendTo("#GetDLCInfofromSteamDB_select");

                // CREATE TAB
                this.createTab(index, name, options);

            });

        },

        // LOAD EVENTS
        loadEvents() {

            // EVENT SUBMIT
            $(document).on("submit", "#GetDLCInfofromSteamDB_submit", (e) => {

                e.preventDefault();

                // RESULT
                let result = "";
                // SELECTED FORMAT
                const selectedFormat = $("#GetDLCInfofromSteamDB_select option:selected").val();
                // GET FORMAT DATA
                const formatData = this.formats[selectedFormat];
                const formatName = formatData.name;

                // WRITE INFO
                result += `; ${this.info.name} by ${this.info.author} v${this.info.version}
; Format: ${formatName}
; AppID: ${this.steamDB.appID}
; AppID Name: ${this.steamDB.appIDName}
; AppID Total DLCs: ${this.steamDB.appIDDLCsCount}
; SteamDB: ${this.info.steamDB}${this.steamDB.appID}
; Homepage: ${this.info.homepage}
; Support: ${this.info.support}\n\n`;

                // CALLBACK
                const formatCallback = formatData.callback({
                    "info": result
                }, this);

                if (typeof formatCallback === "object") {

                    // GET DLCs
                    result += this.bbcode(formatCallback.data);

                    // WRITE RESULT
                    $("#GetDLCInfofromSteamDB_textarea").html(result).show().scrollTop(0);

                    // SET DOWNLOAD FILE
                    $("#GetDLCInfofromSteamDB_downloadFile").attr({
                        href: Download(result),
                        download: formatCallback.name
                    });

                    // ..... AUTO DOWNLOAD
                    if (Storage.isChecked("globalAutoDownload")) {
                        document.getElementById("GetDLCInfofromSteamDB_downloadFile").click();
                    }
                    // .....

                }

                // ..... SAVE LAST SELECTION
                if (Storage.isChecked("globalSaveLastSelectionAndAutoSubmit")) {
                    Storage.set("globalSaveLastSelectionValue", selectedFormat);
                }
                // .....

            });

            // ..... AUTO SUBMIT
            if (Storage.isChecked("globalSaveLastSelectionAndAutoSubmit")) {
                $("#GetDLCInfofromSteamDB_submit").trigger("submit");
            }
            // .....

            // SUBMIT OPTIONS
            $(document).on("submit", "form#GetDLCInfofromSteamDB_submitOptions", (e) => {

                e.preventDefault();

                // EACH
                $(e.currentTarget).find("input, select").each((_index, dom) => {

                    const $this = $(dom);
                    const name = $this.attr("name");
                    const type = $this.attr("type");
                    const value = type === "checkbox" ? $this.prop("checked") : $this.val();

                    // SET
                    Storage.set(name, value);

                });

                // ALERT
                window.alert("Options saved!");

            });

            // RESET OPTIONS
            $(document).on("click", "#GetDLCInfofromSteamDB_resetOptions", (e) => {

                e.preventDefault();

                // CONFIRM
                if (window.confirm("Do you really want to reset options?")) {
                    // CLEAR
                    Storage.clear();
                    // LOAD OPTIONS
                    this.loadOptions();
                    // ALERT
                    window.alert("Restored default options!");
                }

            });

            // STEAMDB - SHOW TABNAV
            $(document).on("click", ".GetDLCInfofromSteamDB_tabNav", (e) => {

                e.preventDefault();

                // SHOW
                $(e.currentTarget).tab("show");

            });

        },

        // LOAD OPTIONS
        loadOptions() {

            $("form#GetDLCInfofromSteamDB_submitOptions").find("input, select").each((_index, dom) => {

                const $this = $(dom);
                const name = $this.attr("name");
                const type = $this.attr("type");
                const tagName = $this.prop("tagName");
                const item = Storage.get(name);

                if (tagName === "SELECT") {
                    const selected = Storage.isValid(item) ? `value = '${item}'` : "selected";
                    $this.find(`option[${selected}]`).prop("selected", true);
                } else if (type === "checkbox") {
                    $this.prop("checked", item === "true");
                } else {
                    $this.val(item);
                }

            });

        },

        // CREATE TAB
        createTab(key, name, options) {

            // CHECK IF OPTIONS IS EMPTY
            if (Object.keys(options).length > 0) {

                // ADD TABNAV-TAB
                $(`<a href='#' data-target='#GetDLCInfofromSteamDB_${key}' class='tabnav-tab GetDLCInfofromSteamDB_tabNav'><img src='https://raw.githubusercontent.com/Sak32009/GetDLCInfoFromSteamDB/master/sak32009-get-dlc-info-from-steamdb.png'> ${name}</a>`).insertBefore(".tabnav-tab[data-target='#dlc']");

                // ADD TAB-PANE
                $(`<div id='GetDLCInfofromSteamDB_${key}' class='tab-pane'>
    <h2>${GM_info.script.name} - ${name}</h2>
    <form id='GetDLCInfofromSteamDB_submitOptions'>
        <button type='submit' class='btn btn-primary btn-lg btn-block' style='margin:5px 0'>Save Options</button>
        <table class='table table-bordered table-fixed' style='margin-bottom:0'>
            <tbody>${this.optionsToInput(options)}</tbody>
        </table>
        <button type='submit' class='btn btn-primary btn-lg btn-block' style='margin:5px 0'>Save Options</button>
    </form>
</div>`).appendTo(".tabbable > .tab-content");

            }

        },

        // OPTIONS TO INPUT
        optionsToInput(options) {

            // RESULT
            let result = "";

            // EACH
            $.each(options, (index, values) => {

                // COMMON
                const title = values.title;
                const type = values.type;
                // INPUT PLACEHOLDER
                const placeholder = values.placeholder || "";
                // SELECT
                const selectOptions = values.options || {};
                const selectDefault = values.default || "";

                result += `<tr><td>${title}</td><td>`;

                switch (type) {
                    case "text": {
                        result += `<input type='text' class='input-block' name='${index}' placeholder='${placeholder}'>`;
                        break;
                    }
                    case "checkbox": {
                        result += `<input type='checkbox' name='${index}'>`;
                        break;
                    }
                    case "select": {
                        result += `<select class='input-block' name='${index}'>`;
                        $.each(selectOptions, (key, value) => {
                            result += `<option value='${key}' ${selectDefault === key ? "selected" : ""}>${value}</option>`;
                        });
                        result += "</select>";
                        break;
                    }
                }

                result += "</td></tr>";

            });

            return result;

        },

        // DLC LIST
        dlcList(str, index_start_zero, index_prefix) {

            // RESULT
            let result = "";
            // INDEX START FROM ZERO
            let index = index_start_zero ? 0 : -1;

            // EACH
            $.each(this.steamDB.appIDDLCs, (key, values) => {

                const name = values.name;
                const date = values.date;
                const timestamp = values.timestamp;

                // ..... IGNORE DLCs 'SteamDB Unknown App'
                if (!(Storage.isChecked("globalIgnoreSteamDBUnknownApp") && name.includes("SteamDB Unknown App"))) {

                    index += 1;

                    result += this.dlcInfoReplace(str, {
                        "dlc_id": key,
                        "dlc_name": name,
                        "dlc_index": this.dlcIDPrefix(index.toString(), parseInt(index_prefix)),
                        "dlc_timestamp": timestamp,
                        "dlc_date": date
                    });

                }
                // .....

            });

            return result;

        },

        // DLC INFO REPLACE
        dlcInfoReplace(str, values) {
            $.each(values, (key, value) => {
                str = str.replace(new RegExp(`{${key}}`, "g"), value);
            });
            return str;
        },

        // DLC ID PREFIX
        dlcIDPrefix(index, prefix) {
            const len = index.length;
            return prefix > len ? "0".repeat(prefix - len) + index : index;
        },

        // BBCODE
        bbcode(str) {

            const re = /\[(\w+)(?:=(.*))?]([^[]+)\[\/(\w+)]/g;
            let re_exec;

            while ((re_exec = re.exec(str)) !== null) {

                // GET DATA
                const [bbcode, bbcodeOpen, bbcodeOpt, bbcodeVal, bbcodeClose] = re_exec;

                // CHECK
                if (bbcodeOpen === bbcodeClose) {

                    const bbcodeOpts = typeof bbcodeOpt !== "undefined" ? bbcodeOpt.split(":") : [];

                    switch (bbcodeOpen) {
                        case "steamdb": {
                            if (bbcodeVal in this.steamDB) {
                                str = str.replace(bbcode, this.steamDB[bbcodeVal]);
                            }
                            break;
                        }
                        case "option": {
                            const item = Storage.get(bbcodeVal);
                            if (Storage.isValid(item)) {
                                str = str.replace(bbcode, item);
                            }
                            break;
                        }
                        case "dlcs": {
                            str = str.replace(bbcode, this.dlcList(bbcodeVal, bbcodeOpts[0] === "true", bbcodeOpts[1] || 0));
                            break;
                        }
                    }

                }

            }

            return str;

        }

    };

    // RUN
    GetDLCInfofromSteamDB.run();

})());
