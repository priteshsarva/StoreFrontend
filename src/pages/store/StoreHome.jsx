// Storefront home. Default = the original Aqua Watch layout (hero → categories
// → per-category collections), which is what most vendors want. A vendor who
// explicitly picks a preset in the portal gets the section-builder layout
// instead — that path stays available, it's just no longer the default.
import React from "react";
import { useStore } from "../../context/StoreContext";
import SectionRenderer from "../../components/sections/registry";
import WhatsAppPromoBar from "../../components/store/WhatsAppPromoBar";
import OriginalHome from "./OriginalHome";
import VelocityHome from "./VelocityHome";
import AtelierHome from "./AtelierHome";
import RedlineHome from "./RedlineHome";
import HavenHome from "./HavenHome";

export default function StoreHome() {
  const { config } = useStore();
  if (!config) return <div className="min-h-[60vh]" />;

  // ?preset= overrides the saved layout WITHOUT persisting — powers the portal's
  // live layout preview so an owner can see each template before committing.
  const override = new URLSearchParams(window.location.search).get("preset");
  const preset = override || config.preset;

  // hand-built full-page templates selected by preset id (no section list)
  if (preset === "velocity") return <VelocityHome variant="velocity" />;
  if (preset === "chrono") return <VelocityHome variant="chrono" />;
  if (preset === "atelier") return <AtelierHome />;
  if (preset === "redline") return <RedlineHome />;
  if (preset === "haven") return <HavenHome />;
  if (preset === "original") return <OriginalHome />;

  // vendor explicitly configured a custom section layout → render that
  if (Array.isArray(config.sections) && config.sections.length) {
    return (
      <>
        <WhatsAppPromoBar />
        <SectionRenderer sections={config.sections} />
      </>
    );
  }

  // default: the original look
  return <OriginalHome />;
}
