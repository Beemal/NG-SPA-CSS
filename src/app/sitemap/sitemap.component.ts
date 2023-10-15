import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.less']
})
export class SitemapComponent {
  sitemapContent: string = '';

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    this.generateSitemap();
  }

  generateSitemap() {
    const routes = this.getApplicationRoutes();
    const host = 'https://charlottesoftwaresolutions.com';
    this.sitemapContent = this.buildSitemapXML(host, routes);
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
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;
  }

}
