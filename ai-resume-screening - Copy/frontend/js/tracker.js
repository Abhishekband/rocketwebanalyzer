// =====================================================
// WEB TRAFFIC ANALYZER - TRACKER
// =====================================================

// Firebase Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// TRAFFIC ANALYZER FIREBASE CONFIG
// =====================================================

const trafficFirebaseConfig = {
    apiKey: "AIzaSyAE1c9OKqGHLEi6ralAiTMbCzwQnU7fuZ0",
    authDomain: "ai-web-traffic-analyzer.firebaseapp.com",
    projectId: "ai-web-traffic-analyzer",
    storageBucket: "ai-web-traffic-analyzer.firebasestorage.app",
    messagingSenderId: "983206433214",
    appId: "1:983206433214:web:f1ec5024f8327ee496a9ef"
};


// =====================================================
// INITIALIZE NAMED FIREBASE APP
// =====================================================

const trafficApp = initializeApp(
    trafficFirebaseConfig,
    "TrafficAnalyzerApp"
);

const trafficDB = getFirestore(trafficApp);


// =====================================================
// WEBSITE ID
// =====================================================

const WEBSITE_ID = "resume-screening";


// =====================================================
// GET / CREATE VISITOR ID
// =====================================================

function getVisitorId() {

    let visitorId = localStorage.getItem(
        "traffic_analyzer_visitor_id"
    );

    if (!visitorId) {

        visitorId =
            "visitor_" +
            crypto.randomUUID();

        localStorage.setItem(
            "traffic_analyzer_visitor_id",
            visitorId
        );
    }

    return visitorId;
}


// =====================================================
// GET / CREATE SESSION ID
// =====================================================

function getSessionId() {

    let sessionId = sessionStorage.getItem(
        "traffic_analyzer_session_id"
    );

    if (!sessionId) {

        sessionId =
            "session_" +
            crypto.randomUUID();

        sessionStorage.setItem(
            "traffic_analyzer_session_id",
            sessionId
        );
    }

    return sessionId;
}


// =====================================================
// DETECT DEVICE TYPE
// =====================================================

function getDeviceType() {

    const width = window.innerWidth;

    if (width <= 768) {
        return "Mobile";
    }

    if (width <= 1024) {
        return "Tablet";
    }

    return "Desktop";
}


// =====================================================
// DETECT BROWSER
// =====================================================

function getBrowser() {

    const userAgent = navigator.userAgent;

    if (
        userAgent.includes("Edg/")
    ) {
        return "Microsoft Edge";
    }

    if (
        userAgent.includes("Chrome/")
    ) {
        return "Google Chrome";
    }

    if (
        userAgent.includes("Firefox/")
    ) {
        return "Mozilla Firefox";
    }

    if (
        userAgent.includes("Safari/")
        &&
        !userAgent.includes("Chrome/")
    ) {
        return "Safari";
    }

    if (
        userAgent.includes("OPR/")
        ||
        userAgent.includes("Opera/")
    ) {
        return "Opera";
    }

    return "Unknown";
}


// =====================================================
// GET REFERRER
// =====================================================

function getReferrer() {

    if (!document.referrer) {
        return "Direct";
    }

    try {

        return new URL(
            document.referrer
        ).hostname;

    } catch (error) {

        return document.referrer;
    }
}


// =====================================================
// TRACK PAGE VIEW
// =====================================================

async function trackPageView() {

    try {

        const visitorId = getVisitorId();

        const sessionId = getSessionId();

        const pageVisited =
            window.location.pathname;

        const deviceType =
            getDeviceType();

        const browser =
            getBrowser();

        const referrer =
            getReferrer();

        const screenSize =
            `${window.screen.width}x${window.screen.height}`;


        // =================================================
        // EXACT 9 TRAFFIC FIELDS
        // =================================================

        const trafficData = {

            // 1. Website ID
            websiteId: WEBSITE_ID,

            // 2. Page visited
            pageVisited: pageVisited,

            // 3. Visitor ID
            visitorId: visitorId,

            // 4. Session ID
            sessionId: sessionId,

            // 5. Device type
            deviceType: deviceType,

            // 6. Browser
            browser: browser,

            // 7. Referrer
            referrer: referrer,

            // 8. Screen size
            screenSize: screenSize,

            // 9. Timestamp
            timestamp: serverTimestamp()
        };


        // =================================================
        // SAVE TO FIRESTORE
        // =================================================

        await addDoc(
            collection(trafficDB, "pageViews"),
            trafficData
        );


        console.log(
            "📊 Traffic recorded:",
            trafficData
        );

    } catch (error) {

        console.error(
            "❌ Traffic tracking error:",
            error
        );
    }
}


// =====================================================
// START TRACKING
// =====================================================

trackPageView();