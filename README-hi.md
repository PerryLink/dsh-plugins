<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugins-hero-en-dark.webp">
  <img src="docs/assets/dsh-plugins-hero-en-light.webp" width="100%" alt="dsh-plugins: PerryLink DSH प्लगइन परिवार का सूचकांक — README.md में 6 व्यावसायिक परिवारों की 27 प्लगइन पंक्तियाँ और 2 सूट, साथ में packages.json (27 पैकेज + 2 सूट), family.json (137 पंक्तियाँ, 126 सक्रिय) और taxonomy.v1.json (91 आइटम); दाईं ओर परिवार-वार पंक्तियाँ और संस्करण के उदाहरण">
</picture>

# PerryLink DSH domain plugins

**PerryLink DSH प्लगइन परिवार का सूचकांक: 6 व्यावसायिक परिवारों में 27 डोमेन पैकेज + 2 वन-कमांड सूट, सभी बिना स्कोप के बेयर npm नाम (`dsh-*`) पर।**

*यह हिन्दी स्थानीयकृत प्रवेश है; सभी 27 प्लगइन, उनके संस्करण और इंस्टॉल कमांड वाली पूरी तालिका चीनी [README.md](README.md) में और पूरा अंग्रेज़ी संस्करण [README.en.md](README.en.md) में है।*

[English](README.en.md) · [简体中文](README.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugins-flow-v5-dark.svg">
  <img src="docs/assets/dsh-plugins-flow-v5-light.svg" width="100%" alt="dsh-plugins की संरचना: सूचकांक तालिकाएँ packages.json, family.json और taxonomy.v1.json के साथ docs/ पेज और market/index.json बनाती हैं, और तीन केवल-पठन गेट — check-taxonomy.mjs, check-docs.mjs और f1-retrieval.mjs — परिणाम जाँचते हैं; सीमा public/synthetic, partial, बिना गणना और बिना GA है">
</picture>

*संरचना: सूचकांक तालिकाएँ → कमिट किया गया JSON → docs/ और market/index.json → केवल-पठन गेट। चित्र के लेबल असली फ़ाइल और स्क्रिप्ट नाम हैं, इसलिए एक ही चित्र पाँचों भाषाओं के लिए है।*

![dsh-plugins असली टर्मिनल रन: node scripts/f1-retrieval.mjs market/index.json में 16 रोज़मर्रा के कार्य-प्रश्नों से खोजता है और हर प्रश्न अपने टॉप 3 में मिलता dsh-* प्लगइन देता है — हिट दर 16/16](docs/assets/dsh-plugins-demo.gif)

*एनिमेशन: रिपॉज़िटरी के अपने केवल-पठन रिट्रीवल प्रयोग `node scripts/f1-retrieval.mjs` का असली stdout (2026-11-21 को दोबारा रन) — `market/index.json` के 136 प्लगइन पर 16 कार्य-प्रश्न, हिट दर 16/16 (100.0%)। कोई नेटवर्क नहीं, कोई मॉडल कॉल नहीं।*

## इंस्टॉल

किसी प्लगइन को उसके npm नाम से जोड़ें: `dsh plugin --profile <profile> add dsh-ghg`। DSH `>=0.2.1-rc.3 <0.3.0` और Node `>=24.9 <25` आवश्यक हैं।

## सूचकांक

27 डोमेन पैकेज 6 व्यावसायिक परिवारों में हैं: Finance Ops (`dsh-einvoice`, `dsh-bankrec`, `dsh-ap-three-way`, `dsh-travel-recon`), Legal Ops (`dsh-legal-intake`, `dsh-legal-clause`), ESG & Quality (`dsh-ghg`, `dsh-qms-capa`), Trade & Logistics (`dsh-hs-candidate`, `dsh-freight-audit`), Docs & Models (`dsh-docx-redline`, `dsh-ifc-qto`) और Verify Utilities (15 पैकेज)। हर पैकेज का लिंक और संस्करण वाली पूरी तालिका [README.md](README.md) में है।

## परिदृश्य लेख

- [इनवॉइस से यात्रा तक: एक ऑडिट-योग्य फ़ाइनेंस-ऑप्स श्रृंखला कैसे चलती है](https://perrylink.github.io/dsh-plugins/articles/finops-suite.html)

## वन-कमांड सूट

दो सूट पूरा सेट एक बार में इंस्टॉल करती हैं: `dsh-finops-suite` (`0.1.0-alpha.10`: `dsh-einvoice` + `dsh-bankrec` + `dsh-ap-three-way` + `dsh-travel-recon`) और `dsh-contract-suite` (`0.1.0-alpha.9`: `dsh-legal-intake` + `dsh-legal-clause`)। कमांड और Gitee / GitCode मिरर [README.md](README.md) में हैं।

## प्लेटफ़ॉर्म

GitHub ([PerryLink/dsh-plugins](https://github.com/PerryLink/dsh-plugins)), npm ([~perrylink](https://www.npmjs.com/~perrylink)), Gitee ([perrylink/dsh-plugins](https://gitee.com/perrylink/dsh-plugins)), GitCode ([PerryLink/dsh-plugins](https://gitcode.com/PerryLink/dsh-plugins)) और दस्तावेज़ीकरण [perrylink.github.io/dsh-plugins](https://perrylink.github.io/dsh-plugins/) पर।

## नामकरण नोट्स

सभी पैकेज बेयर npm नाम इस्तेमाल करते हैं। मूल नाम `dsh-eval-harness` किसी अन्य प्रकाशक के पास है, इसलिए प्रोजेक्ट अब **`dsh-eval-pack`** है और स्कोप वाला पैकेज `@perrylink/dsh-eval-harness` डेप्रिकेटेड है तथा नए पैकेज की ओर इंगित करता है।

## सीमाएँ

सब कुछ public/synthetic, partial, `counted=false` और बिना GA है; ग्राहक डेटा रिपॉज़िटरी, टेस्ट या fixtures में नहीं लिया जाता (केवल MIT/Apache सार्वजनिक नमूने), और alpha को कभी production-ready, ग्राहक-सत्यापित या सिद्ध-सटीकता नहीं कहा जाता। Apache-2.0; देखें [PUBLIC-ONLY-BOUNDARY.md](PUBLIC-ONLY-BOUNDARY.md)।
