import "server-only";

import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = "rest-client-app-40c80";
  const clientEmail =
    "firebase-adminsdk-fbsvc@rest-client-app-40c80.iam.gserviceaccount.com";
  const privateKey =
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCttro/Tn6Q9SuF\n/SqJE87TWlZxPMUUUZfCTqTFjlGgMfG17itMx+510eyMkNPwwod+8Avz/MQ/2rNo\nm37LNkLa7EZFHF71Ar9JUW0+ibpv7lqOs1Rorak1o4ymrWY+qnknSuVAjJu0+Ybo\nnBOxVV2enCNvd2+ytRf8L84xgnODjVB4mrtEM257qVIS35D1l/g9sq+DFOMy7VMv\nihTpPAnH1ct+KKNCrIcecm1kjvdwoxacKVbHvKupj//qGtbOSIL55DuvHA1ytm9U\nMJn6gdKTNg2lsJqbRJf2h5yEoo096MuiEYx4P00MmFeJzW6fZgmqHoqG2j7nteUC\nAnvSYr9RAgMBAAECggEAHB3QzHFYg/7iwgeljFVT6xqali53WaARN6aB/eXYqVyc\nGk3H3WAY5SIKrv+8BiJ+StnwnVeirhEoa7yLS7nnHUcT4pjCd9avfl77Fx20uuwx\n5Rn6hgzhr+heWhYD0A3ImUcCjy2TADpJDzo/57qA8iykgaSrxBmSncNhFNtf9gEz\nGekGmwIMqKFoc92ZDCfMJA4JAo6e36ah9I8kOdlsPa5A6/naNKkxmzoGAY6NWFtc\n844TdEoBXGVFstCnM+V18kmwXBD3OkZE2RRcpFGZdzIJ10F0btETPmg6MOUJIsap\ndgDeXnKZZrHKwajXr9WBy3jq/lGke8/a0rifxpQIJwKBgQDv1YOuIIhkbmkxx6fg\n9T875afuFr5TSHBgMKMWETVFDbsUY24wJAk8dx0AbsQXAIrKEFzyBqmNLSKW9cS3\n/+2oZOQ34DtbN92r1i9B6RCbDB0sSc2azyIQ8BBm/LpLoyj0rUsJPwhci+cc3LXW\nrfOYN04a9HFqoiqoxlmrDZb04wKBgQC5bERTegcFf4jpcWh9ABjSdEAQ0kbEqoJR\nASsnmy5uKAKXSlmSa8Wp8rmKE2ETgeBlxJjId25gsAjRV+d9gZTEUAKX+MpXVf9W\ns0zBy1PZ58PqiOa8Q6hcP5daYV8/YGw1yUQk/0tJt/EvZQzYeQzx8A1BBib4/hAy\nk+HOxdalOwKBgDlXTj1yj8mbUFFTkALMAAtdFDJrg6O73QpSdpuPD7Jr3v+36h9e\nbkrjm65/zShGu+gl02MWTrFvSibXqenoKbUqMhpd5TMg/0HXWsMiaxL26X6uQpcx\n0M5F51YINK5i2ybsy9TxGhmuZVpUNrGWM3iAOI9fREKfdR2XFtc7z4zLAoGACPxe\nM01uma2cjPOaBLTEfy5zDF2kYFODDTnpRXoXve7icUKBJL9kTOAebbqSscdRgJ0O\namifSMA/LSX9ae+lrf3SolrEM4dPYHw/9AROg/jfXbZUuDrvJclPJGojm4aot9KR\nItncZC4t2gYjoTn8jpz7h3Ms4FQvpMPV5Zdg15ECgYEA1Sn4dbkBzNZAjmcRyXKg\n5lRLz/gJNUMTkqwKgppkyUaQtDhqDXcmJfy2UrW33LglTnEjQMGJbmntmVpsDod7\nJJJH288nGAnRiDvQmD0eIsTttQz1+4LHlu0Fm9Ep5vFy60n03hdnJEj3KE3ZrKtb\n9OqeJADOgLLlOzR5t5HLYt8=\n-----END PRIVATE KEY-----\n";

  admin.initializeApp({
    credential: admin.credential.cert({ clientEmail, privateKey, projectId }),
  });
}

export const adminAuth = admin.auth();
