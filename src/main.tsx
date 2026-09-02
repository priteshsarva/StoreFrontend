import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'flowbite';

// HashRouter -> BrowserRouter as of Phase 1D: real per-vendor subdomains and
// SEO both need real paths (#/p/... is invisible to crawlers and to a wildcard
// host's routing). This REQUIRES the host to SPA-fallback every path to
// index.html — see public/_redirects (Netlify/Cloudflare) and vercel.json.
// gh-pages cannot do that, so do not deploy this to gh-pages.
import { BrowserRouter } from 'react-router-dom';

import $ from 'jquery';
import _ from 'lodash';
import noUiSlider from 'nouislider';
import 'datatables.net';
import 'dropzone/dist/dropzone-min.js';
import * as VanillaCalendarPro from 'vanilla-calendar-pro';

window._ = _;
window.$ = $;
window.jQuery = $;
window.DataTable = $.fn.dataTable;
window.noUiSlider = noUiSlider;
window.VanillaCalendarPro = VanillaCalendarPro;


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
