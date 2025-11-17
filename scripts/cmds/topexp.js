module.exports = {
  config: {
    name: "topexp",
    version: "1.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    shortDescription: {
      en: "Top 10 Exp users",
      bn: "Top 10 অভিজ্ঞতা ইউজার"
    },
    longDescription: {
      en: "Shows top 10 users with highest experience points.",
      bn: "শীর্ষ ১০ জন ইউজার যারা সবচেয়ে বেশি অভিজ্ঞতা পেয়েছে তাদের তালিকা দেখায়।"
    },
    category: "group",
    guide: {
      en: "{pn}",
      bn: "{pn}"
    }
  },

  langs: {
    en: {
      noExpUsers: "There are no users with experience points.",
      headerText: "🏆 Top 10 EXP Users 🏆"
    },
    bn: {
      noExpUsers: "কোনো ইউজারের অভিজ্ঞতা পয়েন্ট নেই।",
      headerText: "🏆 শীর্ষ ১০ অভিজ্ঞতা ইউজার 🏆"
    }
  },

  onStart: async function ({ api, message, event, usersData }) {
    try {
      const allUsers = await usersData.getAll();
      const usersWithExp = allUsers.filter(u => u.exp && u.exp > 0);

      if (usersWithExp.length === 0) {
        return message.reply(this.langs.en.noExpUsers);
      }

      const topExp = usersWithExp
        .sort((a, b) => b.exp - a.exp)
        .slice(0, 10);

      const list = topExp.map((u, i) =>
        `${i + 1}. ${u.name || "Unknown"}: ${u.exp} EXP`
      );

      const threadInfo = await api.getThreadInfo(event.threadID);
      const threadLang = threadInfo.data?.lang || "en";
      const lang = ["bn", "en"].includes(threadLang) ? threadLang : "en";
      const header = this.langs[lang].headerText;

      const msg = `${header}:\n${list.join("\n")}`;
      return message.reply(msg);
    } catch (err) {
      console.error("[topexp error]", err);
      return message.reply("❌ Something went wrong while fetching EXP data.");
    }
  }
};
