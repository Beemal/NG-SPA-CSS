import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.less']
})
export class SitemapComponent {
  sitemapContent: String = '';
  stringXmlContent: String = ''

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    this.generateSitemap();
  }

  generateSitemap() {
    const routes = this.getApplicationRoutes();
    const host = 'https://charlottesoftwaresolutions.com';
    this.sitemapContent = this.buildSitemapXML(host, routes);
    this.stringXmlContent = this.formatXml(this.sitemapContent);
  }
  formatXml(xml: String): String {
    const PADDING = ' '.repeat(2);
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');

    return xml.split('\r\n').map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad != 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      pad += indent;

      return PADDING.repeat(pad - indent) + node;
    }).join('\r\n'); 
  }

  getApplicationRoutes(): string[] {
    return this.router.config
      .filter((route: Route) => route.path)
      .map((route: Route) => route.path!);
  }

  buildSitemapXML(host: string, routes: string[]): string {
    const currentDate = new Date().toISOString();
    const urls = routes
      .map((route) => `${host}/${route}`)
      .map(
        (url) => `
          <url>
            <loc>${url}</loc>
            <lastmod>${currentDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n
        ${urls}
      </urlset>`;
  }

}
