import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";

function ensureAnchorsOpenInNewTab(htmlString) {
  if (typeof window === "undefined" || !window.DOMParser) return htmlString;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  doc.querySelectorAll("a[href]").forEach((a) => {
    a.setAttribute("target", "_blank");

    const rel = new Set(
      (a.getAttribute("rel") || "")
        .split(/\s+/)
        .filter(Boolean)
    );
    rel.add("noopener");
    rel.add("noreferrer");
    a.setAttribute("rel", Array.from(rel).join(" "));
  });

  return doc.body.innerHTML;
}

export default function MiddleAdsSection() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchAds() {
      try {
        const res = await api.get("/ads", {
          params: { position: "middle" },
        });

        if (mounted && Array.isArray(res.data)) {
          setAds(res.data.filter(ad => ad.isActive !== false));
        }
      } catch (err) {
        console.error("Error fetching middle ads:", err);
      }
    }

    fetchAds();
    return () => (mounted = false);
  }, []);

  const processedAds = useMemo(() => {
    return ads.map(ad => ({
      ...ad,
      safeHtml: ensureAnchorsOpenInNewTab(ad.content || ""),
    }));
  }, [ads]);

  if (!processedAds.length) return null;

  return (
    <section
      className="ads-container"
      style={{
        marginTop: 5,
        marginBottom: 5,
      }}
    >
      {processedAds.map((ad) => (
        <div key={ad._id} className="column-ad">
          <div
            className="card-body"
            style={{
              boxSizing: "border-box",
              flex: "1 1 auto",
              minHeight: 1,
              padding: "1rem 0.5rem",
              border: "dashed red",
              background: "linear-gradient(#FFC107, #FFFFFF)",
              borderRadius: 20,
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              textAlign: "center",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: ad.safeHtml }} />
          </div>
        </div>
      ))}
    </section>
  );
}
