import axios from 'axios';

export function POST_result(data) {
  return axios.post('https://api.learnet.co.il/email-endpoint.php', data);
}