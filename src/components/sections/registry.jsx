// The section registry — every entry in site_settings.sections is a
// { type, props } object; this file dispatches type to component and wraps
// each in SectionWrap so vendors can control bg/padding uniformly.
//
// Adding a new section type = add one entry here + a component file.
import React from "react";
import SectionWrap from "./SectionWrap";
import SectionTitle from "./SectionTitle";
import Banner from "./Banner";
import BannerGrid from "./BannerGrid";
import FeatureIcons from "./FeatureIcons";
import Testimonials from "./Testimonials";
import RichText from "./RichText";
import CTABanner from "./CTABanner";
import Countdown from "./Countdown";
import ProductsSection from "./ProductsSection";
import CategoriesSection from "./CategoriesSection";
import BrandsSection from "./BrandsSection";

// Every registered type maps to a component and whether it should be wrapped
// in the standard SectionWrap (banners already take the full viewport width).
const REGISTRY = {
  banner:      { Component: Banner,           wrap: false },
  banner_grid: { Component: BannerGrid,       wrap: true  },
  categories:  { Component: CategoriesSection,wrap: true  },
  brands:      { Component: BrandsSection,    wrap: true  },
  products:    { Component: ProductsSection,  wrap: true  },
  features:    { Component: FeatureIcons,     wrap: true  },
  testimonials:{ Component: Testimonials,     wrap: true  },
  text:        { Component: RichText,         wrap: true  },
  cta:         { Component: CTABanner,        wrap: true  },
  countdown:   { Component: Countdown,        wrap: true  },
};

// Renders a single section spec: { type, title?, wrap?, props }.
// - title: optional string → rendered above the section as a SectionTitle
// - wrap:  optional overrides { bg, bg_color, dark, padding, overlay }
function renderOne(spec, idx) {
  const entry = REGISTRY[spec.type];
  if (!entry) return null;
  const { Component, wrap: shouldWrap } = entry;
  const inner = (
    <>
      {spec.title && <SectionTitle text={spec.title} sub={spec.subtitle} />}
      <Component {...(spec.props || {})} />
    </>
  );
  if (!shouldWrap) return <React.Fragment key={idx}>{<Component {...(spec.props || {})} />}</React.Fragment>;
  return <SectionWrap key={idx} {...(spec.wrap || {})}>{inner}</SectionWrap>;
}

// Render a whole layout: an ordered array of section specs.
export default function SectionRenderer({ sections }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;
  return <>{sections.map(renderOne)}</>;
}
