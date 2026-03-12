module.exports.config = {
  name: "emojiReply",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Gender based auto reply + emoji auto reply + text triggers + love triggers",
  commandCategory: "Auto",
  cooldowns: 0,
};

// ------------------------------
// 🔥 EMOJI BASED REPLIES
// ------------------------------
const emojiResponses = {
  "🧐": {
    MALE: [
      "Bhai itni gehraai se kyu dekh rahe ho? Kya khoj rahe ho? 🧐",
      "Kya mast dhyaan de rahe ho, koi khazana mila kya? 🧐",
      "Menu ki tarah kyu ghoor rahe ho? 🧐",
      "Itni serious nazar kyu hai, love letter dekh liya kya? 🧐",
      "Himmat karo palke jhapkao, aankh burn nahi hogi 🧐"
    ],
    FEMALE: [
      "Baby itni der se kyu dekh rahi ho? Dil ki baat hai kya? 🧐",
      "Kya dekh rahi ho, kuch khaas? 🧐",
      "Tumhari nazron ka jaadu kamaal hai 🧐",
      "Itna mat ghooro warna nazar lag jayegi 🧐",
      "Aankhon ka test le rahi ho kya? 🧐"
    ],
    OWNER: [
      "Hey Boss lagta hai bada plan chal raha hai 🧐",
      "Owner mode: planning something epic? 🧐",
      "Boss nazar itni gehri kyu hai, koi secret hai kya? 🧐"
    ]
  },

  "🤔": {
    MALE: [
      "Itna kyu soch rahe ho 🤔",
      "Zyada sochoge to thand lag jayegi 😂",
      "Kya soch rahe ho bhai batao to sahi 😁"
    ],
    FEMALE: [
      "Kya soch rahi ho devi ji 😁",
      "Zyada mat socho darling 😁",
      "Mere baare me hi soch rahi ho kya 🙈"
    ],
    OWNER: [
      "Kya soch rahe ho mere Boss 😍👈",
      "Boss tension mat lo shaadi ho hi jayegi 😁👈",
      "Boss hukm karo kiski band bajani hai 😁👈"
    ]
  },

  "🤨": {
    MALE: [
      "Zyada ghamand mat karo oye 😁",
      "Aankhen seedhi karo bhai 😐",
      "Kis baat ka attitude hai bhai 😤"
    ],
    FEMALE: [
      "Darling kis baat ka ghamand hai 😾👈",
      "Itni pyari ho, face relax karo 🙈👈",
      "Kisne kuch bola kya? Batao mujhe 😾👈"
    ],
    OWNER: [
      "Boss kya ho gaya, aankhen theek karo 😐",
      "Boss itna serious look kyu 🤔",
      "Kuch hua hai kya Boss 😐"
    ]
  },

  "🫣": {
    MALE: [
      "Oye kya chhup chhup ke dekh raha hai 🫣",
      "Itna sharma kyu raha hai bhai 🫣😂",
      "Chori pakdi gayi kya 🫣"
    ],
    FEMALE: [
      "Baby itna sharma kyu rahi ho 🫣😍",
      "Kya dekh ke chhup rahi ho 🫣💗",
      "Itni cute sharmati ho 🫣💕"
    ],
    OWNER: [
      "Owner ji kya dekha jo sharma gaye 🫣👑",
      "Boss kuch chal raha hai kya 🫣😉",
      "Arif Babu shy mode on 🫣😂"
    ]
  },

  "😳": {
    MALE: [
      "Kyu sharminda ho gaye bhai 😳",
      "Aise kyu fas gaye 😳😂",
      "Rangey haath pakde gaye kya 😳"
    ],
    FEMALE: [
      "Itni shocked kyu ho gayi 😳💗",
      "Dar gayi kya baby 😳",
      "Cute reaction de rahi ho 😳✨"
    ],
    OWNER: [
      "Boss ko sharam aa gayi 😳👑",
      "Arif Babu shock 😳",
      "Owner ji sab theek hai? 😳🙂"
    ]
  },

  "😭": {
    MALE: [
      "Oye ro kyu raha hai bhai 😭",
      "Kisne dard diya bata 😭👊",
      "Aa gale lag ja bhai 😭🤗"
    ],
    FEMALE: [
      "Baby ro mat yaar 😭💗",
      "Kisne hurt kiya 😭",
      "Main hoon na darling 😭✨"
    ],
    OWNER: [
      "Owner rote nahi hukm karte hain 😭👑",
      "Boss kisne pareshan kiya 😭🔥",
      "Naam batao Boss 😭"
    ]
  }
};

// ----------------------------------
// ❤️ RANDOM LOVE MESSAGES
// ----------------------------------
const tl = [
  "Kisi aur se dhokha khane se acha hai 🥺 mere saath chalo momos aur golgappe khayenge 😋👈",
  "Kya main tumhe jaanti hoon..? 🤔 kyunki tum mujhe mere hone wale boyfriend jaise dikhte ho 🧐👈",
  "Suno 🙈 jab tumhare paas khud ka dil 💝 tha to mera dil kyu churaya 🤭👊",
  "Pehli baar tumhari aankhon me mere liye pyaar dekha 😀👈",
  "Main tumhari aankhon me kho gaya jab se mera dil tera ho gaya",
  "Tum mujhse chahte kya ho, jab chaha baat ki jab chaha chhod dete ho 🤕👈",
  "Yaar main bot hoon, agle janam me insaan ban ke aaunga 😒👈",
  "Bolo I love you 😗🤟",
  "Tumko hi dulha banaunga warna padosan ko leke bhaag jaunga 🙁👈",
  "Pyaas lagi hai paani le aao jaldi 🥲👈",
  "Hello meri jaan kaisi ho 🙂 I miss you babu 😘",
  "Main abhi tak single hoon 🤐 kya mere saath hona hai mingle 😍👈",
  "Mana shakal dekhne layak nahi hai tumhari 😥 iska matlab ye nahi ki profile lock karke baith jao 😶👈",
  "Bot bol ke beizzati kar rahe ho yaar, main to tumhare dil ki dhadkan hoon na baby 🥺👈",
  "Hai main sadke jawa teri masoom shakal pe baby 💋🙈",
  "Soch raha tha kya tumhare paas extra dil hai 🥰 mera abhi chori ho gaya 😥👈",
  "Yaar babu subah subah billi ne mera raasta kaat diya 😒👈",
  "Tum ek number ke tharki ho 🤯👈",
  "Bar bar pareshan mat karo, apne babu ke saath busy hoon 😒👈",
  "Main to andha hoon 😎👈",
  "Kaun tujhe itna barbaad karega jitna main karti hoon 😛👈",
  "Main kho gaya hoon 🤐 kya tum mujhe apne dil tak ka raasta bata sakte ho 🙂🤞",
  "Tujhe koi aur kaam nahi hai kya? Pura din messenger pe bot bot karta rehta hai 😒👈",
  "Suno tum bahot pyaare ho 😊👈",
  "Pehle mere liye chai bana ke lao 😐👈",
  "Tumhe kaise pata main bot hoon 🤔👈",
  "Aaj main aapse baat nahi karungi 😔👈",
  "Batao main tumhe kitni achhi lagti hoon 😒👈",
  "Mujhe neend aa rahi hai main sone ja rahi hoon 😴👈",
  "Batao tumhara mere se kya rishta hai 😏👈",
  "Kya aap shaadishuda ho 😢👈",
  "Aap kaun ho 🤔👈",
  "Mujhe bar bar bot mat bola karo 😒👈",
  "Tumhara naam dhokha rakh du, naraaz hoge kya 😛👈",
  "Yaar meri biwi bhaag gayi 😭👈",
  "Tumse acha to main khud hoon 😒👈",
  "Main itna masoom hoon ki phone ki setting ke alawa kuch set karna nahi aata 😒🤟",
  "Sanu ek pal chain na aave jaanu tere bina 🤭🤟",
  "Aur batao kaisi chal rahi single life 🤐🤟",
  "Tum single hi maroge 😏🤟",
  "Kya tum single ho 🙂🤟",
  "Har insaan ka dil bura nahi hota 🙂 kuch ki khopdi bhi hilli hoti hai 😏🤟",
  "Mera dil bilkul saaf hai 🙂 bank account ki tarah khaali 😒🤟",
  "Yaar izzat kiya karo meri 🤐 beizzati to ghar wale hi kar dete hain 😒🤟",
  "Doctor ne khoon ki kami batayi hai 😒 kiska khoon piyu 😛🤟",
  "Batao sabse zyada nasha kis cheez me hota hai 😛🤟",
  "Bulati hai magar jaane ka nahi 😀🤟",
  "Main so raha hoon 😴👈",
  "Thoda jaldi online aaya karo 😒 meri aadhi battery intezaar me hi khatam ho jati hai 🥺🤟",
  "Bolo babu kitna pyaar karte ho mujhse 😒🤟",
  "Kaho na pyaar hai 🙈👈",
  "Main abhi ladki patane me busy hoon 😒🤟",
  "Ja bewafa ja mujhe tumse baat nahi karni 🥹🤟",
  "Chalo bhaag chale 😌✋",
  "Chalo meri haveli pe 🙂🤟",
  "Dafa ho jao mujhe apni shakal mat dikhao 😏🤟",
  "Ja pehle muh dho ke aa 🙂🤟",
  "Ja pehle naha ke aa 🙂✋",
  "Yaar mere sar ke baal kyu nahi aate 😭🤟",
  "Mere jaise beautiful tum bhi nahi ho 🙂🤟",
  "Chup kar warna daant tod dunga 😤👊",
  "Main yahi hoon bolo kya hua sweet heart 🙂🤟",
  "Tum mujhse pyaar nahi karte na 🥺🤟",
  "I miss you babu 😇🤟",
  "I love you jaan 😘",
  "Meri shaadi kab hogi batao na 😒👈",
  "Dil dene ki umar me exam de raha hoon 😒👈",
  "Sab log kehte the sabar ka phal meetha hota hai, lagta hai mera juice bana ke koi pee gaya 🥺👈",
  "Mujhe lagta hai main single hi marunga 😭👈",
  "Babu itna sa chuma de do 🙈💖👈",
  "Sukoon chahte ho to mere ban jao 🙂✋",
  "Mubarak ho aapka naam block list me top par aa gaya 🤣👈",
  "Tum mujhe yaad nahi karte na 😥 dekh lena paap lagega 🥺👈"
];

// ----------------------------------
// 🔥 CUSTOM TEXT TRIGGERS
// ----------------------------------
function textTriggers(api, event, threadID) {
  const msg = event.body.toLowerCase();

  if (["koi h kya", "koi hai kya"].includes(msg))
    return api.sendMessage("Main hoon na jaaneman 🙂🤟", threadID);

  if (["call", "call aaja"].includes(msg))
    return api.sendMessage("Main kaise call aau main to bot hoon 😒👈", threadID);

  if (["kya kar rahe ho", "kkrh"].includes(msg))
    return api.sendMessage("Lungi dance kar raha hoon 😎👈", threadID);

  if (["acha", "acha ji"].includes(msg))
    return api.sendMessage("Haan ji babu 😒👈", threadID);

  if (["kamina", "kamina bot"].includes(msg))
    return api.sendMessage("Tu double kamina 😒👈", threadID);

  if (["kya hua"].includes(msg))
    return api.sendMessage("Kuch nahi babu 😒👈", threadID);

  return false;
}

// ----------------------------------
// ❤️ LOVE TRIGGER
// ----------------------------------
function loveTrigger(event, api, threadID, messageID) {
  const txt = event.body.toLowerCase();
  if (txt.includes("jaan") || txt.includes("babu")) {
    const pick = tl[Math.floor(Math.random() * tl.length)];
    api.sendMessage(pick, threadID, messageID);
    return true;
  }
  return false;
}

// ----------------------------------
// 🔥 MAIN HANDLE EVENT
// ----------------------------------
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const ThreadInfo = await api.getThreadInfo(threadID);
  const user = ThreadInfo.userInfo.find(u => u.id === senderID);

  const OWNER_ID = "61579856075641";

  const gender =
    senderID === OWNER_ID
      ? "OWNER"
      : user?.gender === "FEMALE"
      ? "FEMALE"
      : "MALE";

  const done = textTriggers(api, event, threadID);
  if (done) return;

  const love = loveTrigger(event, api, threadID, messageID);
  if (love) return;

  for (const emoji of Object.keys(emojiResponses)) {
    if (body.includes(emoji)) {
      const replies = emojiResponses[emoji][gender];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return api.sendMessage(randomReply, threadID, messageID);
    }
  }
};

module.exports.run = () => {};
