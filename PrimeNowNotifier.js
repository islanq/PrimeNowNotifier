// ==UserScript==
// @name         AutoCheckout
// @namespace    dnslol.com
// @version      0.2
// @description  try to take over the world!
// @author       islanq
// @match        https://primenow.amazon.com/checkout/enter-checkout?merchantId=*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_notification
// ==/UserScript==


// ------- START GLOBALS
var interval = 1; /*.......Interval in minutes            */
var $ = window.jQuery; /*..Reference to main window.      */
var time = new Date(); /*..Initial time for compare.      */
var timer = true; /*.......Should timer contineue?        */
var globalStop = false; /*.Global hard stop. We are done. */
var userEmail = null;
// ------- END GLOBALS
globalStop = !confirm("Get notified when delivery is available?")
if (!globalStop) {
    userEmail = prompt("Please enter email address for notification");
}

if (!globalStop) {
    (function () {

        'use strict';
        $(document).ready(function () {
            var statusCheck = setInterval(function () {
                if (!checkoutAvailable()) {
                    console.log(Math.round((1000 * 60 * 1) / 1000 - (new Date() - time) / 1000) + " seconds until refresh");
                    var current = new Date();
                    if (current - time > 1000 * 60 * 1) {
                        console.log((current - time) / 1000 + " seconds passed");
                        location.reload(true);
                    }
                } else if (timer == true) {
                    postAvailable();
                    timer = false;
                }
            }, 30000); // check every 1000ms
        }); // document ready

    })();


    function checkoutAvailable() {
        var status = $("#delivery-slot-form > div").text();
        return !status.includes("No delivery windows available");
    }

    function postAvailable() {

        console.log("submitting post request");

        var ret = GM_xmlhttpRequest({
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: JSON.stringify({
                "canShop": true,
                "dateTime": new Date(),
                "email": userEmail
            }),
            url: "https://script.google.com/macros/s/AKfycbxCEskfF7qQvbUYaz0eKddO5W2XWMX0D2wx2qcfpD0I4fJHoLV2/exec",
            onreadystatechange: function (res) {
                GM_log("Request state changed to: " + res.readyState);
            },
            onload: function (res) {
                var json = res.responseText;
                console.log(json);
            }
        }); // GM_xmlhttpRequest
        timer = false;
    }
} else {
    console.log("Stopping all amazizon checking activities");
}