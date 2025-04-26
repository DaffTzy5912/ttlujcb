const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL tidak ditemukan' });
  }

  try {
    const response = await fetch(`https://api.ownblox.biz.id/api/ttdl?url=${encodeURIComponent(url)}`);
    const json = await response.json();

    if (json.status !== 200 || !json.download_links || !json.download_links.length) {
      return res.status(500).json({ success: false, message: 'Gagal mengambil video TikTok.' });
    }

    const videoUrl = json.download_links[0].url;
    const audioUrl = json.music; // <<< biasanya ada di field "music" untuk MP3

    res.status(200).json({
      success: true,
      videoUrl,
      audioUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
}
