(function () {
  const STORAGE_KEY = 'pbti-language';

  const QUESTIONS = {
    q1: {
      text: 'A friend is treating you to coffee. What do you order?',
      options: [
        'Anything is fine—as long as there is coffee.',
        'One of my usual go-to drinks.',
        'If nothing appeals to me, I would rather skip it.'
      ]
    },
    q2: {
      text: 'The menu lists “citrus, nuts, and fermented notes.” What is your first reaction?',
      options: [
        'I do not really get it—I will just ask which one tastes good.',
        'I get the general idea, but price and mood still decide.',
        'I read every word and want to know exactly how it will taste.'
      ]
    },
    q3: {
      text: 'You are rushing out in the morning, but your coffee is still being made. What do you do?',
      options: [
        'If I am running late, I skip it and get on with my day.',
        'Depends how tired I am. If I need it, I can wait a little.',
        'I can be a few minutes late. I cannot start the day without coffee.'
      ]
    },
    q4: {
      text: 'You had no plans to get coffee, then an ad for one pops up. What usually happens?',
      options: [
        'I barely notice. Coffee is optional.',
        'Sure, I might grab one while I am at it.',
        'Right—today’s coffee has not happened yet.'
      ]
    },
    q5: {
      text: 'Which description is most likely to win you over for an afternoon coffee?',
      options: [
        'Clean, crisp, and easy to drink.',
        'A reliable classic that rarely misses.',
        'Something with cream, coconut milk, or chocolate sauce.'
      ]
    },
    q6: {
      text: 'The barista asks, “Would you like milk or sugar?” What do you say?',
      options: [
        'No thanks—leave it as it is.',
        'Let me taste it first, then I will decide.',
        'Yes please. Give me a little sweetness and plenty of creaminess.'
      ]
    },
    q7: {
      text: 'Someone posts in the group chat: “This café has a new flavor.” What do you do?',
      options: [
        'Glance at it and move on. I am not that interested.',
        'Save it for a day when I have time.',
        'Open the details and start working out when I can visit.'
      ]
    },
    q8: {
      text: 'Your regular café launches a seasonal special. What do you order?',
      options: [
        'My usual. Reliability is comforting.',
        'If it does not sound too strange, I will give it a try.',
        'It is seasonal—skipping it would feel like missing the holiday.'
      ]
    },
    q9: {
      text: 'You are getting coffee with friends this weekend. What matters most?',
      options: [
        'Good coffee and an easy-to-find location.',
        'A comfortable space. It does not need to be photogenic.',
        'Great light, cups, and tables—ideally, everything photographs well.'
      ]
    },
    q10: {
      text: 'The coffee arrives and your friend is ready to drink. What do you do?',
      options: [
        'Start drinking right away. Fresh is best.',
        'If it really looks good, take one quick photo.',
        'Wait—the angle is not right yet.'
      ]
    },
    q11: {
      text: 'A friend mentions a new café nearby. How do you respond?',
      options: [
        'Completely surprised: “Wait, when did that open?”',
        'Vaguely familiar: “I think I have seen it online, but I have not been.”',
        'Fully briefed: “I know—I have already checked the menu and opening hours.”'
      ]
    },
    q12: {
      text: 'Someone suddenly asks, “Is there a café nearby where we can sit for a while?” What do you do?',
      options: [
        'Nothing comes to mind, so I open the map.',
        'I can probably think of a few.',
        'Confidently name the best spots from my carefully curated shortlist.'
      ]
    },
    q13: {
      text: 'If you could pair your coffee with food, how would you feel?',
      options: [
        'No pairing needed. Coffee is enough on its own.',
        'Depends. If I am hungry, I might add something.',
        'Ideally there is bread or dessert; otherwise something feels missing.'
      ]
    },
    q14: {
      text: 'You have an amazing coffee at a café. What are you most likely to do next?',
      options: [
        'Enjoy it and leave the research to someone else.',
        'Remember the name so I can order it again.',
        'Study the recipe and try to recreate it at home.'
      ]
    },
    q15: {
      text: 'It is the weekend, you want coffee, and you do not want to leave home. What do you do?',
      options: [
        'Open a delivery app and see who can get here fastest.',
        'Look for drip bags or ready-to-drink coffee at home—anything will do.',
        'Head to my home coffee corner and make myself a proper cup.'
      ]
    }
  };

  const TYPES = {
    MASTER: {
      name: '煮理人',
      intro: 'Buried in a mountain of research, you managed to find a little coffee.',
      desc: 'Other people finish a cup and say, “That was bitter.” You are already tracing the beans back to their origin. Acidity should make sense, aromas should have layers, and if a coffee tastes difficult, it had better have a good reason.'
    },
    NEED: {
      name: '咖啡续命者',
      intro: 'Patient barely responsive. Begin caffeine infusion immediately.',
      desc: 'Your eyes are open, but your mind is still buffering. One dose of caffeine gets the system to boot—just about. Your body may be at the desk, but your soul has not clocked in. Your coworkers recommend increasing the dosage.'
    },
    YUMMY: {
      name: '不想吃苦者',
      intro: 'Life is bitter enough. Coffee does not need to join in.',
      desc: 'A little acidity is fine, just do not let it take over. A little bitterness is fine, just do not make it a personality. While others chase layers of flavor, you simply want to know whether the next sip will improve your mood.'
    },
    NEW: {
      name: '咖界金舌头',
      intro: 'Ding! A new flavor has dropped. Please taste responsibly.',
      desc: 'The moment a new drink launches, your hand opens the details page on its own. Whether it tastes good is almost beside the point—if you have not tried it, the day feels incomplete. Add the words “limited edition” and reason promptly logs off.'
    },
    PHOTO: {
      name: '咖啡记录仪',
      intro: 'Before your mouth gets a taste, your phone does.',
      desc: 'The second coffee hits the table, you start hunting for the best light. When someone asks how it tastes, you say, “Wait—the photo is not done yet!” The coffee can wait; the composition cannot.'
    },
    REPORT: {
      name: '人形咖啡雷达',
      intro: 'New target spotted on the corner. Over and out.',
      desc: 'A new café has barely opened and you have already walked past it three times. You have studied the storefront, menu, queue, and seating while pretending you were just in the neighborhood. You even know which table is best.'
    },
    DESSERT: {
      name: '碳水守护者',
      intro: 'You did not come for coffee. You came for the bread.',
      desc: 'You check the pastry case before ordering and keep looking back after you sit down. Coffee is there to make the scene respectable; the real reason you cannot leave is that freshly baked croissant.'
    },
    BREW: {
      name: '宅家主理人',
      intro: 'You make your own path—and your own coffee.',
      desc: 'Other people make coffee at home. You run a production. Water temperature, cups, and workflow all need a plan. The results may vary, but today’s resident barista must report for duty.'
    }
  };

  const DIMENSIONS = {
    '风味理解': 'Flavor Literacy',
    '咖啡刚需': 'Caffeine Dependency',
    '口味友好': 'Easy Drinking',
    '尝新雷达': 'Novelty Radar',
    '视觉记录': 'Visual Storytelling',
    '探店情报': 'Café Intel',
    '餐食搭配': 'Food Pairing',
    '主理动手': 'Hands-On Brewing'
  };

  const EXACT_TEXT = new Map([
    ['找到我们', 'Find Us'],
    ['熊熊咖啡屋', 'Bear Coffee Club'],
    ['咖啡熊格测试', 'Coffee Bearsonality Quiz'],
    ['开始测试', 'Start the Quiz'],
    ['切换风格', 'Switch Style'],
    ['你的主类型', 'Your Coffee Type'],
    ['多维选项权重综合匹配', 'Matched across all eight dimensions'],
    ['每个选择都会同时影响多个熊格倾向，雷达轮廓共同形成当前结果。', 'Every answer influences several coffee tendencies; together, they shape your final profile.'],
    ['隐藏熊格已激活', 'Hidden Bearsonality Unlocked'],
    ['特殊因子已接管', 'A special factor took over'],
    ['特殊因子过强，系统已直接跳过常规熊格审判。', 'The special factor was so strong that the system skipped the usual Bearsonality verdict.'],
    ['系统强制兜底', 'Wildcard Result'],
    ['标准熊格库无法稳定匹配', 'No standard type was a stable match'],
    ['标准熊格库对你的脑回路集体罢工了，于是系统把你强制分配给了兜底熊格。', 'The standard profiles could not make sense of your answers, so the system assigned you its wildcard Bearsonality.'],
    ['补充题', 'Bonus Question'],
    ['都做完了，现在可以查看你的结果了。', 'All done—your result is ready.'],
    ['全选完才会放行。', 'Answer every question to continue.'],
    ['返回首页', 'Back to Start'],
    ['提交并查看结果', 'See My Result'],
    ['上一题', 'Previous'],
    ['下一题', 'Next'],
    ['查看结果', 'See My Result'],
    ['请完成全部题目', 'Answer All Questions'],
    ['PBTI 咖啡八维轮廓', 'Your Eight-Dimension Coffee Profile'],
    ['熊格简单解读', 'Your Bearsonality'],
    ['友情提示', 'A Friendly Note'],
    ['该测试仅供娱乐，结果只是你当下咖啡偏好的一个轻量切片，不代表固定性格或专业判断。', 'This quiz is just for fun. Your result is a light snapshot of your current coffee preferences—not a fixed personality label or a professional assessment.'],
    ['作者的话', 'A Note from the Creator'],
    ['PBTI 想记录的不是“你是哪一种咖啡”，而是你如何把咖啡放进日常生活里：续命、尝新、探店、拍照、配餐，或是在家认真给自己弄一杯。', 'PBTI is not trying to decide which coffee you are. It looks at how coffee fits into your everyday life: keeping you going, chasing new flavors, exploring cafés, taking photos, pairing food, or making a proper cup at home.'],
    ['八维轮廓不是评分高低，而是一个偏好形状。它会随着作息、心情、城市和最近喝到的那杯咖啡改变。', 'The eight-dimension profile is not a scorecard; it is the shape of your preferences. It can shift with your routine, mood, city, and even the last cup you had.'],
    ['希望这个结果能像一次轻松的咖啡聊天：让你更理解自己的小习惯，也多一个和朋友互相调侃的理由。', 'Think of this result as a relaxed coffee chat: a chance to notice your little habits and gain one more thing to tease your friends about.'],
    ['重新测试', 'Retake the Quiz'],
    ['购买', 'Shop'],
    ['加载失败，请刷新重试', 'Could not load. Please refresh and try again.'],
    ['加载中...', 'Loading...'],
    ['MBTI已经过时，XBTI来了！', 'MBTI is old news. XBTI is here!'],
    ['在财富自由之前，率先实现熊格测试自由', 'Bearsonality freedom—well before financial freedom.'],
    ['想创建你自己的熊格测试？一行命令搞定：', 'Want to create your own Bearsonality quiz? One command is all it takes:']
  ]);

  function getLanguage() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === 'en' ? 'en' : 'zh';
    } catch (error) {
      return 'zh';
    }
  }

  function setLanguage(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // The selection still applies for this reload when storage is unavailable.
    }
    window.location.reload();
  }

  const language = getLanguage();
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.title = language === 'en' ? 'PBTI Coffee Bearsonality Quiz' : 'PBTI 咖啡熊格测试';

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function addLanguageSwitch() {
    const hero = document.querySelector('#root .hero-minimal');
    const isLandingScreen = hero && !document.querySelector('.test-wrap, .result-wrap');
    if (!isLandingScreen || hero.querySelector('.language-switch')) return;

    const control = document.createElement('div');
    control.className = 'language-switch';
    control.setAttribute('role', 'group');
    control.setAttribute('aria-label', language === 'en' ? 'Choose language' : '选择语言');

    [['zh', '中文'], ['en', 'EN']].forEach(([value, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'language-switch__button';
      button.textContent = label;
      button.setAttribute('aria-pressed', String(language === value));
      button.addEventListener('click', () => {
        if (value !== language) setLanguage(value);
      });
      control.append(button);
    });

    hero.prepend(control);
  }

  function translateQuestions() {
    document.querySelectorAll('.question').forEach((question, index) => {
      const input = question.querySelector('input[type="radio"][name]');
      const copy = input && QUESTIONS[input.name];
      if (!copy) return;

      const badge = question.querySelector('.badge');
      const title = question.querySelector('.question-title');
      setText(badge, `Question ${index + 1}`);
      setText(title, copy.text);
      question.querySelectorAll('.option').forEach((option, optionIndex) => {
        const label = option.querySelector('.option-code')?.nextElementSibling;
        if (copy.options[optionIndex]) setText(label, copy.options[optionIndex]);
      });
    });
  }

  function typeCodeFromElement(element) {
    const value = element?.textContent || '';
    if (value.includes('HOME-MASTER')) return 'BREW';
    if (value.includes('CAMERA')) return 'PHOTO';
    if (value.includes('EAT')) return 'DESSERT';
    return Object.keys(TYPES).find((code) => value.includes(code));
  }

  function translateTypeCards() {
    document.querySelectorAll('.gallery-card').forEach((card) => {
      const code = typeCodeFromElement(card.querySelector('.gallery-code'));
      const copy = TYPES[code];
      if (!copy) return;
      const name = card.querySelector('.gallery-cn');
      const intro = card.querySelector('.gallery-intro');
      setText(name, copy.name);
      setText(intro, copy.intro);
    });

    const resultType = document.querySelector('.result-wrap .type-name');
    const code = typeCodeFromElement(resultType);
    const copy = TYPES[code];
    if (!copy) return;
    const name = resultType.querySelector('.type-cn');
    const intro = document.querySelector('.result-wrap .poster-caption');
    const desc = document.querySelector('.result-wrap .profile-analysis p');
    const image = document.querySelector('.result-wrap .poster-image');
    setText(name, copy.name);
    setText(intro, copy.intro);
    setText(desc, copy.desc);
    if (image) image.alt = `${code} — ${copy.name}`;
  }

  function translateExactText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.parentElement?.closest('script, style, .language-switch, .site-hub')) return;
      const trimmed = node.nodeValue.trim();
      if (EXACT_TEXT.has(trimmed)) {
        node.nodeValue = node.nodeValue.replace(trimmed, EXACT_TEXT.get(trimmed));
      }
    });

    document.querySelectorAll('.radar-label').forEach((label) => {
      const translated = DIMENSIONS[label.textContent.trim()];
      if (translated) setText(label, translated);
    });

    document.querySelectorAll('.question .badge').forEach((badge, index) => {
      setText(badge, `Question ${index + 1}`);
    });
  }

  let applying = false;
  function applyLocalization() {
    if (applying) return;
    applying = true;
    try {
      addLanguageSwitch();
      if (language === 'en') {
        document.querySelector('.site-hub')?.setAttribute('aria-label', 'Coffee world navigation');
        translateQuestions();
        translateTypeCards();
        translateExactText();
        document.querySelector('.radar-chart-wrap')?.setAttribute('aria-label', 'PBTI eight-dimension radar chart');
      }
    } finally {
      applying = false;
    }
  }

  function queueLocalization() {
    window.requestAnimationFrame(() => {
      applyLocalization();
      window.setTimeout(applyLocalization, 0);
    });
  }

  window.addEventListener('hashchange', queueLocalization);
  window.addEventListener('pageshow', queueLocalization);
  applyLocalization();
  queueLocalization();
})();
