const axios = require('axios');
const base64 = require('js-base64');

const username = 'teste_fiqon';
const password = 'senha@115#';

async function authenticate() {
  const token = await axios.post(
    'https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/autenticacao/57441afd5a59ccd4c62816683fcc8d665c42bb7b12857fc64a6cace4ababdc67f78c70b044',
    {},
    {
      auth: {
        username: username,
        password: password
      }
    }
  );

  return token.data.api_token;
}

async function getPillars(token) {
  let allPillars = [];
  let page = 0;
  let totalPages = 0;

  while (page <= totalPages) {
    const response = await axios.get('https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/listar_pilares/76b07f1dbf18eabde7b8e3611ab078daa0f34b094cc9856d20d6d0b15fb3b7a99f697e451d', {
      params: {
        page: page,
        api_token: token
      }
    });
    if(response.data.data === null){
      break;
    }
    allPillars = allPillars.concat(response.data.data);
    totalPages = response.data.next_page;
    page++;
  }

  return allPillars;
}

async function sendInformation(token, pillars) {
  const concatenatedString = pillars.join('');
  const base64String = base64.encode(concatenatedString);

  const response = await axios.post(
    'https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/envia_resposta/7b56940678e89802e02e1981a8657206d639f657d4c58efb8d8fb74814799d1c001ec121c6',
    {
      answer: base64String
    },
    {
      params: {
        api_token: token
      }
    }
  );
  
  return response.data;
}

async function main() {
  try {
    const token = await authenticate();
    const pillars = await getPillars(token);
    const result = await sendInformation(token, pillars);

    console.log('Resultado:', result);
  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }
}

main();