(async () => {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Company Name
  const nameInput = document.querySelector('input[name="companyName"]') || document.querySelector('input[placeholder*="Company Name"]') || document.querySelector('input[id*="companyName"]') || document.querySelector('.next-input input');
  // Since we have refs, let's use the refs in the agent logic or just use selectors here.
  // Actually, I'll use the refs provided in the snapshot for reliability if possible, or just standard selectors.

  // Let's use the refs from the snapshot by mapping them.
  // e11: Company Name
  // e53: Street Address
  // e55: City
  // e61: Zip Code
  // e64, e65, e66: Main Products
  // e79: Registration Year
  // e408: Total Employees
  // e420: Legal Representative

  // I will use a more robust way to find elements in the console script.
  const findInputByLabel = (labelText) => {
    const labels = Array.from(document.querySelectorAll('label, .next-form-item-label, th'));
    const label = labels.find(l => l.textContent.includes(labelText));
    if (label) {
      if (label.tagName === 'TH') {
        return label.nextElementSibling.querySelector('input, select, textarea');
      }
      const htmlFor = label.getAttribute('for');
      if (htmlFor) return document.getElementById(htmlFor);
      return label.parentElement.querySelector('input, select, textarea');
    }
    return null;
  };

  // 1. Company Name (EN)
  // The user says "Company Name (EN)" and "Company Name (ZH)".
  // If only one box exists, I'll try to find if there's a toggle or if I should append.
  // But usually there are two. Let's look for both.
  const nameEn = "Shenzhen Mengshang Technology Co., Ltd.";
  const nameZh = "深圳市盟商科技有限公司";

  // e11 seems to be the one.
  const nameBox = document.querySelector('input[name="companyName"]') || document.querySelector('.next-input input');
  if (nameBox) {
      nameBox.value = nameEn;
      nameBox.dispatchEvent(new Event('input', { bubbles: true }));
      nameBox.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // 2. Operational Address
  const streetInput = document.querySelector('input[name="street"]') || document.querySelector('textarea[name="street"]'); // ref e53
  if (streetInput) {
    streetInput.value = "Room B802-06, Factory Building 1, Tian'an Cyber Park, 524 Qinglin Road, Huanggekeng Community, Longcheng Street.";
    streetInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const cityInput = document.querySelector('input[name="city"]'); // ref e55
  if (cityInput) {
    cityInput.value = "Shenzhen";
    cityInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const zipInput = document.querySelector('input[name="zip"]'); // ref e61
  if (zipInput) {
    zipInput.value = "518172";
    zipInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // 3. Main Products
  const products = ["E-commerce Software", "Marketing Technology", "Global Sourcing Tools"];
  const productInputs = document.querySelectorAll('input[name^="mainProduct"]');
  products.forEach((p, i) => {
    if (productInputs[i]) {
      productInputs[i].value = p;
      productInputs[i].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // 4. Registration Year
  const yearSelect = document.querySelector('select[name="establishYear"]') || document.querySelector('.next-select[name="establishYear"]');
  // For next-select, we might need to click and then click the option.
  // But let's try setting value first.

  // 5. Legal Representative
  const legalRepInput = document.querySelector('input[name="legalPerson"]'); // ref e420
  if (legalRepInput) {
    legalRepInput.value = "Long Weijun";
    legalRepInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  return { success: true };
})()