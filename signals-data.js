// Record dates refer to original source publication. Keep IDs stable when editing.
window.DMS_SIGNALS = [
  {
    id: 'indonesia-azure-region', country: 'Indonesia', region: 'East Asia & Pacific',
    date: '2025-04-15', topic: 'Cloud markets', status: 'Generally available',
    headline: 'Azure makes Indonesia Central generally available',
    takeaway: 'A local deployment option opens up, while workload owners still need to check the regional service catalog.',
    summary: 'Microsoft said its first Indonesian cloud region was generally available on 15 April 2025 and selectable in the Azure portal. The region has three availability zones.',
    evidence: 'The April notice establishes the date of general availability. Microsoft’s May 27 launch-event release describes the public launch and is a separate milestone.',
    why: 'In-country deployment creates an option for workloads that need local processing or seek lower network latency. Buyers still need to check the specific services and redundancy options available for their architecture.',
    watch: 'Regional availability of the required managed services, accelerator types, and quotas, plus the location of backups and support access.',
    limits: 'Provider disclosures establish the launch and listed zones. They give no comparable measure of available GPU capacity, observed latency, or customer uptake.',
    sources: [
      ['Microsoft Indonesia · General availability', '2025-04-15', 'https://news.microsoft.com/id-id/2025/04/15/general-availability-of-indonesia-central-cloud-region/'],
      ['Microsoft Indonesia · Public launch event', '2025-05-27', 'https://news.microsoft.com/id-id/2025/05/27/microsoft-opens-indonesia-central/']
    ]
  },
  {
    id: 'india-ai-compute-portal', country: 'India', region: 'South Asia',
    date: '2025-03-06', topic: 'AI compute access', status: 'Program launched',
    headline: 'India launches a portal for subsidized AI compute',
    takeaway: 'A shared access program offers a way to support users who cannot justify buying their own accelerators.',
    summary: 'India’s Ministry of Electronics and Information Technology launched the AI Compute Portal under the IndiaAI Mission as a way for startups, researchers and enterprises to obtain subsidized compute services.',
    evidence: 'The ministry said the portal would initially provide access to 10,000 GPUs, with another 8,693 planned. The figures describe the ministry’s stated rollout at launch.',
    why: 'Pooling access could help smaller teams trial workloads before committing to hardware or long contracts. Program design determines which users benefit.',
    watch: 'Eligibility, approval times, effective hourly cost, available GPU types and successful allocations to smaller teams.',
    limits: 'The announcement gives initial and planned access figures. It does not supply an independently measured count of simultaneous GPU availability, actual utilization or geographic distribution.',
    sources: [
      ['India Press Information Bureau · Portal launch', '2025-03-06', 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2108961&lang=2&reg=48']
    ]
  },
  {
    id: 'thailand-aws-region', country: 'Thailand', region: 'East Asia & Pacific',
    date: '2025-01-07', topic: 'Cloud markets', status: 'Generally available',
    headline: 'AWS opens a three-zone cloud region in Thailand',
    takeaway: 'Multiple local zones create a deployment option for resilience, subject to service availability and application design.',
    summary: 'AWS announced general availability of its Asia Pacific (Thailand) Region, with three availability zones and the identifier ap-southeast-7.',
    evidence: 'The AWS launch post identifies the region and zones. A separate AWS release describes a plan to invest more than US$5 billion in Thailand.',
    why: 'A multi-zone region gives users a local option for distributing workloads across zones. Resilience still depends on how customers deploy applications and how they handle recovery outside the region.',
    watch: 'Regional service coverage, disaster recovery options, workload pricing and evidence of investment execution.',
    limits: 'The investment figure is a provider plan. The launch disclosure does not measure realized spending, utilization or the stock of AI accelerators.',
    sources: [
      ['AWS News Blog · Thailand region launch', '2025-01-07', 'https://aws.amazon.com/blogs/aws/announcing-the-new-aws-asia-pacific-thailand-region/'],
      ['Amazon Press Center · Thailand regional announcement', '2025-01-08', 'https://press.aboutamazon.com/sg/aws/2025/1/aws-launches-infrastructure-region-in-thailand']
    ]
  },
  {
    id: 'mexico-google-cloud-region', country: 'Mexico', region: 'Latin America & Caribbean',
    date: '2024-12-04', topic: 'Cloud markets', status: 'Region opened',
    headline: 'Google Cloud opens a region in Querétaro',
    takeaway: 'A local Google Cloud region adds a hosting option for buyers evaluating where to process covered workloads.',
    summary: 'Google Cloud announced the opening of its Querétaro region in December 2024. Its Mexico-facing announcement said the region was already operating.',
    evidence: 'The company’s global launch post identifies Querétaro and describes the launch. Google’s Spanish-language announcement adds local context and confirms that the region was in operation when announced.',
    why: 'The opening gives buyers another location to evaluate for local workloads. Procurement teams can compare the scope of services, portability, data handling and end-to-end costs across deployment options.',
    watch: 'Which managed services and accelerator instances are actually listed, and how local hosting costs compare with other locations for a defined workload.',
    limits: 'Both launch posts come from the same company. They establish the company-reported opening and provide no independent measurement of capacity, costs or use.',
    sources: [
      ['Google Cloud · Querétaro region opening', '2024-12-04', 'https://cloud.google.com/blog/products/infrastructure/google-cloud-announces-41st-cloud-region-in-mexico'],
      ['Google · Mexico launch announcement (Spanish)', '2024-12-04', 'https://blog.google/intl/es-419/actualizaciones-de-producto/en-la-nube/region-cloud-mexico-nueva/']
    ]
  },
  {
    id: 'brazil-anpd-data-transfers', country: 'Brazil', region: 'Latin America & Caribbean',
    date: '2024-08-23', topic: 'Data governance', status: 'Rule adopted',
    headline: 'Brazil’s data regulator sets out cross-border transfer mechanisms',
    takeaway: 'The choice of cloud region sits alongside a separate assessment of how personal data move across borders.',
    summary: 'Brazil’s national data protection authority, ANPD, adopted Resolution 19/2024 on international transfers of personal data and approved standard contractual clauses.',
    evidence: 'Article 9 sets out the relationship between a legal basis and a valid transfer mechanism. The resolution lists several mechanisms, and its annex contains the regulator’s standard clauses.',
    why: 'Buyers should map where personal data are stored and where they may be accessed before choosing a hosting arrangement. Backups and remote support can matter to that review.',
    watch: 'ANPD guidance and decisions, sector-specific obligations, and whether cloud contracts reflect how data are routed and accessed.',
    limits: 'This entry summarizes one legal instrument. Obligations depend on the particular processing arrangement and applicable rules. It offers no legal advice.',
    sources: [
      ['ANPD · Resolution 19/2024, Articles 9 and 16 and Annex II (Portuguese)', '2024-08-23', 'https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024']
    ]
  },
  {
    id: 'malaysia-aws-region', country: 'Malaysia', region: 'East Asia & Pacific',
    date: '2024-08-21', topic: 'Cloud markets', status: 'Generally available',
    headline: 'AWS makes its Malaysia region generally available',
    takeaway: 'A local cloud launch creates an option to test service fit for Malaysian workloads, including recovery requirements.',
    summary: 'AWS announced that its Asia Pacific (Malaysia) Region was generally available with three availability zones and the identifier ap-southeast-5.',
    evidence: 'AWS’s launch documentation gives the region code and zone count and describes the zone design. The AWS press release separately describes projected investment through 2038.',
    why: 'Organizations can evaluate whether a local region meets their latency, data location and continuity needs. The useful unit for procurement is the actual workload and the services it requires.',
    watch: 'Coverage of managed services and accelerators, cost of replication, and whether local demand supports a broader service catalog.',
    limits: 'These are company disclosures. Zone counts describe region architecture and do not provide a measure of available GPUs, prices or market share.',
    sources: [
      ['AWS News Blog · Malaysia region launch', '2024-08-21', 'https://aws.amazon.com/blogs/aws/now-open-aws-asia-pacific-malaysia-region/'],
      ['Amazon Press Center · Malaysia infrastructure region', '2024-08-21', 'https://press.aboutamazon.com/2024/8/aws-launches-infrastructure-region-in-malaysia']
    ]
  },
  {
    id: 'kenya-g42-olkaria-plan', country: 'Kenya', region: 'Sub-Saharan Africa',
    date: '2024-05-22', topic: 'Data center investment', status: 'Announced plan · delay reported',
    headline: 'Kenya’s proposed Olkaria cloud campus faces reported delays',
    takeaway: 'The case shows why investment announcements and usable cloud capacity belong in different categories.',
    summary: 'Microsoft and G42 announced a Kenyan digital investment initiative that included a proposed geothermal-powered data center campus in Olkaria to support a new Azure region for East Africa. Reuters relayed a subsequent report of delays in May 2026.',
    evidence: 'Microsoft’s original announcement described an initial US$1 billion for the wider package and tied its proposed operating timeline to definitive agreements. In May 2026 Reuters relayed Bloomberg reporting on a delay linked to payment guarantees and noted it had not independently verified that reporting.',
    why: 'A proposed facility can signal interest in a market. Decisions about planned service delivery depend on whether the facility is financed, commissioned and open to customers.',
    watch: 'A participant’s confirmation of definitive agreements, revised scope or timeline, construction milestones, and eventual service availability.',
    limits: 'The initial amount was for the wider package. The later delay is attributed secondary reporting, with no confirmed opening or cancellation in the sources cited here.',
    sources: [
      ['Microsoft · Kenya digital investment announcement', '2024-05-22', 'https://news.microsoft.com/source/2024/05/22/microsoft-and-g42-announce-1-billion-comprehensive-digital-ecosystem-initiative-for-kenya/'],
      ['Reuters · Follow-up reporting on the proposed facility', '2026-05-10', 'https://www.reuters.com/world/africa/microsofts-african-data-center-falters-payment-demands-bloomberg-news-reports-2026-05-10/']
    ]
  }
];
