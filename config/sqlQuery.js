exports.CardCampaign = (limit) => {
  return `select articles.id, articles.title as nameCampaigns, 
                        articles.imageData as imgArticle, articles.desShort, 
                        orgs.imageData as imgLogo, orgs.title as nameOrgs, 
                        DATEDIFF(campaigns.endDate,campaigns.startDate) as leftDay,
                        sum(donations.amount) as amount, count(donations.amount) as countDonations, campaigns.target
                        from articles inner join campaigns on articles.campaignId = campaigns.id inner join orgs on articles.orgId = orgs.id
                        inner join donations on donations.campaignId = campaigns.id 
                        group by articles.title
                        order by id desc
                        limit ${limit}`;
};

exports.CardArticlesCategory = (id) => {
  return `select articles.id, articles.title as nameCampaigns, 
  articles.imageData as imgArticle, articles.desShort, 
  orgs.imageData as imgLogo, orgs.title as nameOrgs, 
  DATEDIFF(campaigns.endDate,campaigns.startDate) as leftDay,
  sum(donations.amount) as amount, count(donations.amount) as countDonations, campaigns.target
  from articles inner join campaigns on articles.campaignId = campaigns.id inner join orgs on articles.orgId = orgs.id
  inner join donations on donations.campaignId = campaigns.id 
  WHERE  articles.campaignId IS NOT NULL and  articles.categoryId = ${id}
  group by articles.title
  ORDER BY id DESC`;
};

exports.CardOrgs = (limit) => {
  return `select id, title, imageData, desShort from orgs limit ${limit};`;
};

exports.CardBannerNotId = `select articles.id, articles.title as nameCampaigns,
                        articles.imageData, articles.desShort
                        from articles
                        order by id desc
                        limit 4`;

exports.CardBannerId = (id) => {
  return `select articles.id, articles.title as nameCampaigns, 
                        articles.imageData, articles.desShort
                        from articles
                        where categoryId = ${id}
                        order by id desc
                        limit 4`;
};

exports.CardCategories = `select id, title from categories limit 5`;

exports.CardArticle = (limit) => {
  return `select articles.id, articles.title,
                        articles.imageData, articles.desShort, articles.datePublished
                        from articles
                        where campaignId IS NULL
                        order by id desc
                        limit ${limit}`;
};

exports.CampaignDetail = `select articles.id, articles.title as nameCampaigns, articles.imageData as imgArticle, articles.desShort,
                        articles.content, articles.datePublished, articles.orgId,
                        orgs.imageData as imgOrg, orgs.title as nameOrgs,
                        DATEDIFF(campaigns.endDate,campaigns.startDate) as leftday, 
                        sum(donations.amount) as amount, count(donations.amount) as donations,campaigns.target
                        from articles inner join campaigns on articles.campaignId = campaigns.id inner join orgs on articles.orgId = orgs.id
                        inner join donations on donations.campaignId = campaigns.id
                        where articles.id =`;
exports.CampaignRelative = (idOrg, idArticle) => {
  return `select articles.id, articles.title, 
                        articles.imageData, articles.desShort,
                        DATEDIFF(campaigns.endDate,campaigns.startDate) as leftday,
                        sum(donations.amount) as amount, count(donations.amount) as donations,campaigns.target
                        from articles inner join campaigns on articles.campaignId = campaigns.id 
                        inner join orgs on articles.orgId = orgs.id
                        inner join donations on donations.campaignId = campaigns.id
                        where articles.orgId = ${idOrg} and articles.id  <> ${idArticle}
                        group by articles.id
                        limit 3`;
};
exports.ArticleDetail = `select articles.id, articles.title,
                          articles.imageData, articles.desShort, articles.datePublished, articles.content
                          from articles
                          where id = `;
exports.OrgDetail = (id) => {
  return `SELECT id, title, imageData, desShort, detail FROM orgs where id = ${id}`;
};

exports.AccountDetail = (username) => {
  return `SELECT inforusers.firstName, inforusers.middleName, inforusers.lastName, 
  inforusers.email, inforusers.address, inforusers.bankAccountNumber, 
  inforusers.bankName, users.username, orgs.title as titleOrgs, orgs.address as orgsAddress,
  orgs.id as idOrgs,
  orgs.linkWebsite, orgs.phone as phoneOrgs, orgs.imageData
FROM users 
LEFT JOIN inforusers ON users.id = inforusers.userId 
LEFT JOIN orgs ON users.id = orgs.userId
  where users.username = '${username}'`;
};

exports.CampaignsOfOrg = (username) => {
  return `select articles.id as idArticles, campaigns.id as idCampaign, articles.title, articles.desShort, 
  campaigns.startDate, campaigns.endDate, campaigns.target
  from articles inner join campaigns on articles.campaignId = campaigns.id 
  where campaigns.userId = (select id from users where username = '${username}');`;
};

exports.DonationsOfUser = (username) => {
  return `select articles.title, donations.amount, donations.payment, donations.createdAt
  from articles inner join campaigns on articles.campaignId = campaigns.id 
  inner join donations on donations.campaignId = campaigns.id
  where donorId = (
  select id from donors where userId = (select id from users where username= '${username}') 
  )`;
};
