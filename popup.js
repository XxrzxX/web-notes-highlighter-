class HighlightManager {
  constructor() {
    this.highlights = [];
    this.filteredHighlights = [];
    this.activeCategory = 'all';
    this.searchTerm = '';
    this.init();
  }

  async init() {
    await this.loadHighlights();
    this.setupEventListeners();
    this.render();
  }

  async loadHighlights() {
    try {
      const result = await chrome.storage.local.get();
      this.highlights = [];
      
      Object.keys(result).forEach(url => {
        if (Array.isArray(result[url]) && result[url].length > 0) {
          result[url].forEach(highlight => {
            this.highlights.push({
              ...highlight,
              url: url,
              domain: new URL(url).hostname
            });
          });
        }
      });
    } catch (e) {
      this.highlights = [];
    }
    this.filterHighlights();
  }

  setupEventListeners() {
    document.getElementById('searchBox').addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.filterHighlights();
      this.render();
    });

    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeCategory = e.target.dataset.category;
        this.filterHighlights();
        this.render();
      });
    });

    document.getElementById('colorPicker').addEventListener('change', (e) => {
      chrome.storage.local.set({ highlightColor: e.target.value });
    });

    document.getElementById('exportBtn').addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Export button clicked');
      this.exportHighlights();
    });
  }

  filterHighlights() {
    this.filteredHighlights = this.highlights.filter(highlight => {
      const matchesCategory = this.activeCategory === 'all' || highlight.category === this.activeCategory;
      const matchesSearch = !this.searchTerm || highlight.text.toLowerCase().includes(this.searchTerm);
      return matchesCategory && matchesSearch;
    });
  }

  render() {
    const container = document.getElementById('highlightsList');
    
    if (this.filteredHighlights.length === 0) {
      container.innerHTML = '<div class="no-results">No highlights found</div>';
      return;
    }

    container.innerHTML = this.filteredHighlights.map(highlight => `
      <div class="highlight-item">
        <div class="highlight-text">${this.escapeHtml(highlight.text)}</div>
        <div class="highlight-meta">
          Category: ${highlight.category} | ${new Date(highlight.timestamp || highlight.time).toLocaleDateString()}<br>
          <small>${highlight.domain || 'Unknown site'}</small>
        </div>
      </div>
    `).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async exportHighlights() {
    try {
      const result = await chrome.storage.local.get();
      const allHighlights = {};
      
      Object.keys(result).forEach(url => {
        if (Array.isArray(result[url]) && result[url].length > 0) {
          allHighlights[url] = result[url];
        }
      });

      if (Object.keys(allHighlights).length === 0) {
        alert('No highlights found to export!');
        return;
      }

      let textContent = `MY HIGHLIGHTS\n`;
      textContent += `Exported: ${new Date().toLocaleString()}\n`;
      textContent += `Total: ${Object.values(allHighlights).reduce((sum, arr) => sum + arr.length, 0)} highlights\n\n`;
      textContent += '='.repeat(80) + '\n\n';

      Object.keys(allHighlights).forEach(url => {
        textContent += `📄 ${url}\n`;
        textContent += '-'.repeat(80) + '\n';
        
        allHighlights[url].forEach((highlight, index) => {
          textContent += `${index + 1}. [${highlight.category.toUpperCase()}] ${highlight.text}\n`;
          textContent += `   Date: ${new Date(highlight.timestamp || highlight.time).toLocaleString()}\n\n`;
        });
        
        textContent += '\n';
      });

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `highlights-${new Date().toISOString().split('T')[0]}.txt`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      console.log('Export completed as text');
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed: ' + e.message);
    }
  }
}

new HighlightManager();