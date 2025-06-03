// Типы для переводов
export type Language = "ru" | "kz" | "en"

// Интерфейс для переводов
export interface Translations {
  // Общие
  siteName: string

  // Навигация
  nav: {
    home: string
    services: string
    documents: string
    about: string
    faq: string
  }

  // Кнопки
  buttons: {
    login: string
    startConsultation: string
    languageSelector: string
    download: string
    viewMore: string
    goTo: string
    logout: string
    send: string
    back: string
  }

  // Футер
  footer: {
    allRightsReserved: string
    privacyPolicy: string
  }

  // Главная страница
  home: {
    hero: {
      title: string
      subtitle: string
    }
    benefits: {
      title: string
      fast: {
        title: string
        description: string
      }
      ai: {
        title: string
        description: string
      }
      confidentiality: {
        title: string
        description: string
      }
    }
  }

  // Страница услуг
  services: {
    hero: {
      title: string
      subtitle: string
    }
    offerings: {
      title: string
      consultation: {
        title: string
        description: string
      }
      contracts: {
        title: string
        description: string
      }
      documents: {
        title: string
        description: string
      }
    }
  }

  // Страница документов
  documents: {
    hero: {
      title: string
      subtitle: string
    }
    available: {
      title: string
    }
    documentTypes: {
      rentContract: string
      employmentContract: string
      saleContract: string
      courtClaim: string
      complaint: string
    }
  }

  // Страница о нас
  about: {
    hero: {
      title: string
      subtitle: string
    }
    howItWorks: {
      title: string
      processing: {
        title: string
        description: string
      }
      technologies: {
        title: string
        description: string
      }
      accuracy: {
        title: string
        description: string
      }
    }
  }

  // Страница FAQ
  faq: {
    hero: {
      title: string
      subtitle: string
    }
    questions: {
      title: string
      howWorks: {
        question: string
        answer: string
      }
      accuracy: {
        question: string
        answer: string
      }
    }
  }

  // Страница профиля
  profile: {
    hero: {
      title: string
      welcome: string
      logoutButton: string
    }
    sections: {
      title: string
      history: {
        title: string
        description: string
      }
      documents: {
        title: string
        description: string
      }
      settings: {
        title: string
        description: string
      }
    }
    loading: string
  }

  // Страница чата
  chat: {
    title: string
    newChat: string
    searchChats: string
    tabs: {
      chats: string
      categories: string
    }
    categories: {
      family: string
      labor: string
      property: string
      consumer: string
      auto: string
      documents: string
    }
    messages: {
      today: string
      yesterday: string
      typing: string
      read: string
      sent: string
      popularQuestions: string
      inputPlaceholder: string
      waitingResponse: string
      enterToSend: string
    }
    quickQuestions: {
      terminateContract: string
      inheritanceDocuments: string
      refundDefective: string
      disputeFine: string
    }
  }

  // Компонент чата поддержки
  supportChat: {
    title: string
    greeting: string
    inputPlaceholder: string
    waitingResponse: string
    response: string
  }

  // Страницы авторизации
  auth: {
    login: {
      title: string
      subtitle: string
      formTitle: string
      formSubtitle: string
      username: string
      password: string
      forgotPassword: string
      rememberMe: string
      loginButton: string
      noAccount: string
      register: string
      errors: {
        emptyFields: string
        invalidCredentials: string
        generalError: string
      }
      success: {
        title: string
        message: string
      }
    }
    register: {
      title: string
      subtitle: string
      formTitle: string
      formSubtitle: string
      username: string
      email: string
      password: string
      confirmPassword: string
      agreeTerms: string
      termsLink: string
      privacyLink: string
      registerButton: string
      haveAccount: string
      loginLink: string
      errors: {
        emptyUsername: string
        emptyEmail: string
        invalidEmail: string
        emptyPassword: string
        shortPassword: string
        passwordMismatch: string
        agreeTerms: string
        generalError: string
      }
    }
    forgotPassword: {
      title: string
      subtitle: string
      formTitle: string
      formSubtitle: string
      email: string
      sendButton: string
      backToLogin: string
      success: {
        title: string
        message: string
        backButton: string
      }
      errors: {
        emptyEmail: string
        invalidEmail: string
        generalError: string
      }
    }
  }

  // Страница баланса и платежей
  balance: {
    title: string
    subtitle: string
    currentBalance: string
    depositBalance: string
    transactionHistory: string
    amount: string
    paymentMethods: string
    createPayment: string
    paymentCreated: string
    paymentSuccess: string
    goToPayment: string
    insufficientFunds: string
    requestCost: string
    baseCost: string
    additionalCost: string
    costDepends: string
    errors: {
      fetchFailed: string
      paymentFailed: string
      invalidAmount: string
    }
    transactions: {
      date: string
      type: string
      description: string
      amount: string
      status: string
      deposit: string
      withdrawal: string
      completed: string
      pending: string
      failed: string
      empty: string
    }
  }
}

// Русские переводы
export const ru: Translations = {
  siteName: "LegalAI",

  nav: {
    home: "Главная",
    services: "Услуги",
    documents: "Документы",
    about: "О нас",
    faq: "FAQ",
  },

  buttons: {
    login: "Вход",
    startConsultation: "Начать консультацию",
    languageSelector: "Язык",
    download: "Скачать",
    viewMore: "Подробнее",
    goTo: "Перейти",
    logout: "Выйти из аккаунта",
    send: "Отправить",
    back: "Назад",
  },

  footer: {
    allRightsReserved: "© 2025 LegalAI. Все права защищены.",
    privacyPolicy: "Политика конфиденциальности",
  },

  home: {
    hero: {
      title: "Юридическая помощь с поддержкой ИИ",
      subtitle:
        "Используйте наш сервис для получения быстрых и точных юридических консультаций. Искусственный интеллект поможет вам разобраться в сложных вопросах.",
    },
    benefits: {
      title: "Почему выбирают нас?",
      fast: {
        title: "Быстро и удобно",
        description: "Мгновенные консультации 24/7 в любое время.",
      },
      ai: {
        title: "Искусственный интеллект",
        description: "Современные нейросети анализируют ваш запрос и дают точный ответ.",
      },
      confidentiality: {
        title: "Гарантия конфиденциальности",
        description: "Ваши данные защищены и не передаются третьим лицам.",
      },
    },
  },

  services: {
    hero: {
      title: "Наши юридические услуги",
      subtitle: "Мы предлагаем широкий спектр юридических услуг, от консультаций до анализа документов.",
    },
    offerings: {
      title: "Что мы предлагаем?",
      consultation: {
        title: "Юридические консультации",
        description: "Получите советы по вашему вопросу от ИИ-ассистента.",
      },
      contracts: {
        title: "Анализ договоров",
        description: "Наш ИИ проверит документ на риски и нюансы.",
      },
      documents: {
        title: "Готовые образцы документов",
        description: "Получение юридических документов на основании образцов.",
      },
    },
  },

  documents: {
    hero: {
      title: "Шаблоны документов",
      subtitle: "Скачайте необходимые юридические шаблоны.",
    },
    available: {
      title: "Доступные шаблоны",
    },
    documentTypes: {
      rentContract: "Договор аренды",
      employmentContract: "Трудовой договор",
      saleContract: "Договор купли-продажи",
      courtClaim: "Заявление в суд",
      complaint: "Жалоба в государственные органы",
    },
  },

  about: {
    hero: {
      title: "О нашем ИИ-ассистенте",
      subtitle:
        "Наш ИИ-ассистент использует передовые технологии обработки естественного языка для предоставления точных и быстрых юридических консультаций.",
    },
    howItWorks: {
      title: "Как работает система?",
      processing: {
        title: "Обработка запроса",
        description: "ИИ анализирует ваш вопрос и определяет его юридическую специфику.",
      },
      technologies: {
        title: "Используемые технологии",
        description: "Наша система основана на GPT, LLM и других современных нейросетях.",
      },
      accuracy: {
        title: "Точность ответов",
        description: "ИИ обучен на юридических текстах, но не заменяет профессионального юриста.",
      },
    },
  },

  faq: {
    hero: {
      title: "Часто задаваемые вопросы",
      subtitle: "Ответы на наиболее популярные вопросы о сервисе LegalAI.",
    },
    questions: {
      title: "Популярные вопросы",
      howWorks: {
        question: "Как работает LegalAI?",
        answer: "LegalAI использует искусственный интеллект для анализа юридических вопросов и составления документов.",
      },
      accuracy: {
        question: "Насколько точны ответы?",
        answer: "Наш ИИ обучен на обширной базе данных, но не заменяет консультацию с юристом.",
      },
    },
  },

  profile: {
    hero: {
      title: "Личный кабинет",
      welcome: "Добро пожаловать",
      logoutButton: "Выйти из аккаунта",
    },
    sections: {
      title: "Ваши данные",
      history: {
        title: "История консультаций",
        description: "Просматривайте свои прошлые юридические вопросы и ответы.",
      },
      documents: {
        title: "Сохранённые документы",
        description: "Доступ к вашим договорам, заявлениям и другим файлам.",
      },
      settings: {
        title: "Настройки профиля",
        description: "Изменение личных данных, подписки и уведомлений.",
      },
    },
    loading: "Загрузка...",
    errors: {
      fetchFailed: "Не удалось загрузить данные профиля",
      retry: "Повторить попытку",
      backToLogin: "Вернуться на страницу входа",
    },
  },

  chat: {
    title: "Чат с юристом",
    newChat: "Новый чат",
    searchChats: "Поиск чатов...",
    tabs: {
      chats: "Чаты",
      categories: "Категории",
    },
    categories: {
      family: "Семейное право",
      labor: "Трудовое право",
      property: "Недвижимость",
      consumer: "Защита потребителей",
      auto: "Автоправо",
      documents: "Документы",
    },
    messages: {
      today: "Сегодня",
      yesterday: "Вчера",
      typing: "печатает...",
      read: "Прочитано",
      sent: "Отправлено",
      popularQuestions: "Популярные вопросы:",
      inputPlaceholder: "Введите ваш вопрос...",
      waitingResponse: "Ожидание ответа...",
      enterToSend: "Нажмите Enter для отправки, Shift+Enter для переноса строки",
    },
    quickQuestions: {
      terminateContract: "Как расторгнуть трудовой договор?",
      inheritanceDocuments: "Какие документы нужны для оформления наследства?",
      refundDefective: "Что делать, если продавец не возвращает деньги за бракованный товар?",
      disputeFine: "Как оспорить штраф ГИБДД?",
    },
  },

  supportChat: {
    title: "Чат с поддержкой",
    greeting: "Здравствуйте! Чем я могу вам помочь?",
    inputPlaceholder: "Введите сообщение...",
    waitingResponse: "Ожидание ответа...",
    response: "Спасибо за ваш вопрос. Наш специалист скоро с вами свяжется.",
  },

  auth: {
    login: {
      title: "Вход в систему",
      subtitle: "Войдите в свой аккаунт, чтобы получить доступ к персональным консультациям и сохраненным документам",
      formTitle: "Вход в LegalAI",
      formSubtitle: "Введите свои данные для входа в систему",
      username: "Имя пользователя",
      password: "Пароль",
      forgotPassword: "Забыли пароль?",
      rememberMe: "Запомнить меня",
      loginButton: "Войти",
      noAccount: "Нет аккаунта?",
      register: "Зарегистрироваться",
      errors: {
        emptyFields: "Пожалуйста, заполните все поля",
        invalidCredentials: "Неверный логин или пароль",
        generalError: "Произошла ошибка при входе",
      },
      success: {
        title: "Регистрация успешна!",
        message: "Ваш аккаунт был успешно создан. Теперь вы можете войти в систему.",
      },
    },
    register: {
      title: "Регистрация",
      subtitle: "Создайте аккаунт, чтобы получить доступ ко всем возможностям LegalAI",
      formTitle: "Создание аккаунта",
      formSubtitle: "Заполните форму для регистрации в системе",
      username: "Имя пользователя",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтверждение пароля",
      agreeTerms: "Я согласен с",
      termsLink: "условиями использования",
      privacyLink: "политикой конфиденциальности",
      registerButton: "Зарегистрироваться",
      haveAccount: "Уже есть аккаунт?",
      loginLink: "Войти",
      errors: {
        emptyUsername: "Введите имя пользователя",
        emptyEmail: "Введите email",
        invalidEmail: "Введите корректный email",
        emptyPassword: "Введите пароль",
        shortPassword: "Пароль должен содержать минимум 8 символов",
        passwordMismatch: "Пароли не совпадают",
        agreeTerms: "Необходимо согласиться с условиями",
        generalError: "Произошла ошибка при регистрации",
      },
    },
    forgotPassword: {
      title: "Восстановление пароля",
      subtitle: "Мы отправим вам инструкции по сбросу пароля на указанный email",
      formTitle: "Забыли пароль?",
      formSubtitle: "Введите email, указанный при регистрации",
      email: "Email",
      sendButton: "Отправить инструкции",
      backToLogin: "Вернуться на страницу входа",
      success: {
        title: "Инструкции отправлены",
        message:
          "Мы отправили инструкции по сбросу пароля на ваш адрес. Пожалуйста, проверьте вашу почту и следуйте указаниям в письме.",
        backButton: "Вернуться на страницу входа",
      },
      errors: {
        emptyEmail: "Пожалуйста, введите email",
        invalidEmail: "Пожалуйста, введите корректный email",
        generalError: "Произошла ошибка при отправке",
      },
    },
  },
  balance: {
    title: "Управление балансом",
    subtitle: "Пополняйте баланс и отслеживайте историю транзакций",
    currentBalance: "Текущий баланс",
    depositBalance: "Пополнение баланса",
    transactionHistory: "История транзакций",
    amount: "Сумма пополнения (тг)",
    paymentMethods: "Выберите сумму пополнения и способ оплаты",
    createPayment: "Пополнить баланс",
    paymentCreated: "Платеж создан",
    paymentSuccess: "Оплата успешна!",
    goToPayment: "Перейти к оплате",
    insufficientFunds: "Недостаточно средств",
    requestCost: "Стоимость запроса",
    baseCost: "Базовая стоимость",
    additionalCost: "Дополнительно за объем",
    costDepends: "Стоимость зависит от длины сообщения",
    errors: {
      fetchFailed: "Не удалось загрузить баланс",
      paymentFailed: "Не удалось создать платеж",
      invalidAmount: "Пожалуйста, введите корректную сумму",
    },
    transactions: {
      date: "Дата",
      type: "Тип",
      description: "Описание",
      amount: "Сумма",
      status: "Статус",
      deposit: "Пополнение",
      withdrawal: "Списание",
      completed: "Выполнено",
      pending: "В обработке",
      failed: "Ошибка",
      empty: "История транзакций пуста",
    },
  },
}

// Казахские переводы
export const kz: Translations = {
  siteName: "LegalAI",

  nav: {
    home: "Басты бет",
    services: "Қызметтер",
    documents: "Құжаттар",
    about: "Біз туралы",
    faq: "FAQ",
  },

  buttons: {
    login: "Кіру",
    startConsultation: "Кеңес алу",
    languageSelector: "Тіл",
    download: "Жүктеу",
    viewMore: "Толығырақ",
    goTo: "Өту",
    logout: "Шығу",
    send: "Жіберу",
    back: "Артқа",
  },

  footer: {
    allRightsReserved: "© 2025 LegalAI. Барлық құқықтар қорғалған.",
    privacyPolicy: "Құпиялылық саясаты",
  },

  home: {
    hero: {
      title: "ЖИ қолдауымен заңгерлік көмек",
      subtitle:
        "Жылдам және дәл заңгерлік кеңес алу үшін біздің қызметті пайдаланыңыз. Жасанды интеллект күрделі мәселелерді шешуге көмектеседі.",
    },
    benefits: {
      title: "Неге бізді таңдайды?",
      fast: {
        title: "Жылдам және ыңғайлы",
        description: "Кез келген уақытта 24/7 жедел кеңестер.",
      },
      ai: {
        title: "Жасанды интеллект",
        description: "Заманауи нейрондық желілер сұрауыңызды талдап, дәл жауап береді.",
      },
      confidentiality: {
        title: "Құпиялылық кепілдігі",
        description: "Сіздің деректеріңіз қорғалған және үшінші тұлғаларға берілмейді.",
      },
    },
  },

  services: {
    hero: {
      title: "Біздің заңгерлік қызметтер",
      subtitle: "Біз кеңес беруден бастап құжаттарды талдауға дейін кең ауқымды заңгерлік қызметтерді ұсынамыз.",
    },
    offerings: {
      title: "Біз не ұсынамыз?",
      consultation: {
        title: "Заңгерлік кеңестер",
        description: "ЖИ-ассистенттен сұрағыңыз бойынша кеңес алыңыз.",
      },
      contracts: {
        title: "Келісімшарттарды талдау",
        description: "Біздің ЖИ құжатты тәуекелдер мен нюанстарға тексереді.",
      },
      documents: {
        title: "Дайын құжаттар үлгілері",
        description: "Үлгілер негізінде заңдық құжаттарды алу.",
      },
    },
  },

  documents: {
    hero: {
      title: "Құжат үлгілері",
      subtitle: "Қажетті заңдық үлгілерді жүктеп алыңыз.",
    },
    available: {
      title: "Қолжетімді үлгілер",
    },
    documentTypes: {
      rentContract: "Жалдау шарты",
      employmentContract: "Еңбек шарты",
      saleContract: "Сату-сатып алу шарты",
      courtClaim: "Сотқа арыз",
      complaint: "Мемлекеттік органдарға шағым",
    },
  },

  about: {
    hero: {
      title: "Біздің ЖИ-ассистент туралы",
      subtitle:
        "Біздің ЖИ-ассистент дәл және жылдам заңгерлік кеңестер беру үшін табиғи тілді өңдеудің озық технологияларын қолданады.",
    },
    howItWorks: {
      title: "Жүйе қалай жұмыс істейді?",
      processing: {
        title: "Сұрауды өңдеу",
        description: "ЖИ сұрағыңызды талдап, оның заңдық ерекшелігін анықтайды.",
      },
      technologies: {
        title: "Қолданылатын технологиялар",
        description: "Біздің жүйе GPT, LLM және басқа да заманауи нейрондық желілерге негізделген.",
      },
      accuracy: {
        title: "Жауаптардың дәлдігі",
        description: "ЖИ заңдық мәтіндерде оқытылған, бірақ кәсіби заңгерді алмастырмайды.",
      },
    },
  },

  faq: {
    hero: {
      title: "Жиі қойылатын сұрақтар",
      subtitle: "LegalAI қызметі туралы ең танымал сұрақтарға жауаптар.",
    },
    questions: {
      title: "Танымал сұрақтар",
      howWorks: {
        question: "LegalAI қалай жұмыс істейді?",
        answer: "LegalAI заңдық сұрақтарды талдау және құжаттарды жасау үшін жасанды интеллектті қолданады.",
      },
      accuracy: {
        question: "Жауаптар қаншалықты дәл?",
        answer: "Біздің ЖИ кең деректер базасында оқытылған, бірақ заңгермен кеңесуді алмастырмайды.",
      },
    },
  },

  profile: {
    hero: {
      title: "Жеке кабинет",
      welcome: "Қош келдіңіз",
      logoutButton: "Шығу",
    },
    sections: {
      title: "Сіздің деректеріңіз",
      history: {
        title: "Кеңестер тарихы",
        description: "Өткен заңдық сұрақтарыңыз бен жауаптарыңызды қараңыз.",
      },
      documents: {
        title: "Сақталған құжаттар",
        description: "Келісімшарттарыңызға, арыздарыңызға және басқа файлдарыңызға қол жеткізу.",
      },
      settings: {
        title: "Профиль параметрлері",
        description: "Жеке деректерді, жазылымды және хабарландыруларды өзгерту.",
      },
    },
    loading: "Жүктелуде...",
  },

  chat: {
    title: "Заңгермен сөйлесу",
    newChat: "Жаңа чат",
    searchChats: "Чаттарды іздеу...",
    tabs: {
      chats: "Чаттар",
      categories: "Санаттар",
    },
    categories: {
      family: "Отбасы құқығы",
      labor: "Еңбек құқығы",
      property: "Жылжымайтын мүлік",
      consumer: "Тұтынушылар құқығын қорғау",
      auto: "Автоқұқық",
      documents: "Құжаттар",
    },
    messages: {
      today: "Бүгін",
      yesterday: "Кеше",
      typing: "теруде...",
      read: "Оқылды",
      sent: "Жіберілді",
      popularQuestions: "Танымал сұрақтар:",
      inputPlaceholder: "Сұрағыңызды енгізіңіз...",
      waitingResponse: "Жауап күтілуде...",
      enterToSend: "Жіберу үшін Enter, жаңа жол үшін Shift+Enter басыңыз",
    },
    quickQuestions: {
      terminateContract: "Еңбек шартын қалай бұзуға болады?",
      inheritanceDocuments: "Мұраны рәсімдеу үшін қандай құжаттар қажет?",
      refundDefective: "Сатушы ақаулы тауар үшін ақшаны қайтармаса не істеу керек?",
      disputeFine: "ЖПҚ айыппұлын қалай даулауға болады?",
    },
  },

  supportChat: {
    title: "Қолдау қызметімен сөйлесу",
    greeting: "Сәлеметсіз бе! Сізге қалай көмектесе аламын?",
    inputPlaceholder: "Хабарлама енгізіңіз...",
    waitingResponse: "Жауап күтілуде...",
    response: "Сұрағыңыз үшін рахмет. Біздің маман жақын арада сізбен байланысады.",
  },

  auth: {
    login: {
      title: "Жүйеге кіру",
      subtitle: "Жеке кеңестер мен сақталған құжаттарға қол жеткізу үшін аккаунтыңызға кіріңіз",
      formTitle: "LegalAI жүйесіне кіру",
      formSubtitle: "Жүйеге кіру үшін деректеріңізді енгізіңіз",
      username: "Пайдаланушы аты",
      password: "Құпия сөз",
      forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
      rememberMe: "Мені есте сақтау",
      loginButton: "Кіру",
      noAccount: "Аккаунтыңыз жоқ па?",
      register: "Тіркелу",
      errors: {
        emptyFields: "Барлық өрістерді толтырыңыз",
        invalidCredentials: "Қате логин немесе құпия сөз",
        generalError: "Кіру кезінде қате орын алды",
      },
      success: {
        title: "Тіркелу сәтті!",
        message: "Сіздің аккаунтыңыз сәтті құрылды. Енді жүйеге кіре аласыз.",
      },
    },
    register: {
      title: "Тіркелу",
      subtitle: "LegalAI-дің барлық мүмкіндіктеріне қол жеткізу үшін аккаунт жасаңыз",
      formTitle: "Аккаунт жасау",
      formSubtitle: "Жүйеге тіркелу үшін форманы толтырыңыз",
      username: "Пайдаланушы аты",
      email: "Email",
      password: "Құпия сөз",
      confirmPassword: "Құпия сөзді растау",
      agreeTerms: "Мен келісемін",
      termsLink: "қолдану шарттарымен",
      privacyLink: "құпиялылық саясатымен",
      registerButton: "Тіркелу",
      haveAccount: "Аккаунтыңыз бар ма?",
      loginLink: "Кіру",
      errors: {
        emptyUsername: "Пайдаланушы атын енгізіңіз",
        emptyEmail: "Email енгізіңіз",
        invalidEmail: "Дұрыс email енгізіңіз",
        emptyPassword: "Құпия сөзді енгізіңіз",
        shortPassword: "Құпия сөз кемінде 8 таңбадан тұруы керек",
        passwordMismatch: "Құпия сөздер сәйкес келмейді",
        agreeTerms: "Шарттармен келісу қажет",
        generalError: "Тіркелу кезінде қате орын алды",
      },
    },
    forgotPassword: {
      title: "Құпия сөзді қалпына келтіру",
      subtitle: "Біз сізге көрсетілген email-ге құпия сөзді қалпына келтіру нұсқаулығын жібереміз",
      formTitle: "Құпия сөзді ұмыттыңыз ба?",
      formSubtitle: "Тіркелу кезінде көрсетілген email-ді енгізіңіз",
      email: "Email",
      sendButton: "Нұсқаулықты жіберу",
      backToLogin: "Кіру бетіне оралу",
      success: {
        title: "Нұсқаулық жіберілді",
        message:
          "Біз сіздің адресіңізге құпия сөзді қалпына келтіру нұсқаулығын жібердік. Поштаңызды тексеріп, хаттағы нұсқауларды орындаңыз.",
        backButton: "Кіру бетіне оралу",
      },
      errors: {
        emptyEmail: "Email енгізіңіз",
        invalidEmail: "Дұрыс email енгізіңіз",
        generalError: "Жіберу кезінде қате орын алды",
      },
    },
  },
}

// Английские переводы
export const en: Translations = {
  siteName: "LegalAI",

  nav: {
    home: "Home",
    services: "Services",
    documents: "Documents",
    about: "About",
    faq: "FAQ",
  },

  buttons: {
    login: "Login",
    startConsultation: "Start Consultation",
    languageSelector: "Language",
    download: "Download",
    viewMore: "View More",
    goTo: "Go to",
    logout: "Logout",
    send: "Send",
    back: "Back",
  },

  footer: {
    allRightsReserved: "© 2025 LegalAI. All rights reserved.",
    privacyPolicy: "Privacy Policy",
  },

  home: {
    hero: {
      title: "AI-Powered Legal Assistance",
      subtitle:
        "Use our service to get quick and accurate legal advice. Artificial intelligence will help you navigate complex issues.",
    },
    benefits: {
      title: "Why Choose Us?",
      fast: {
        title: "Fast and Convenient",
        description: "Instant consultations 24/7 anytime.",
      },
      ai: {
        title: "Artificial Intelligence",
        description: "Modern neural networks analyze your request and provide an accurate answer.",
      },
      confidentiality: {
        title: "Confidentiality Guarantee",
        description: "Your data is protected and not shared with third parties.",
      },
    },
  },

  services: {
    hero: {
      title: "Our Legal Services",
      subtitle: "We offer a wide range of legal services, from consultations to document analysis.",
    },
    offerings: {
      title: "What We Offer",
      consultation: {
        title: "Legal Consultations",
        description: "Get advice on your issue from an AI assistant.",
      },
      contracts: {
        title: "Contract Analysis",
        description: "Our AI will check the document for risks and nuances.",
      },
      documents: {
        title: "Ready-made samples of documents",
        description: "Obtaining legal documents based on samples.",
      },
    },
  },

  documents: {
    hero: {
      title: "Document Templates",
      subtitle: "Download the necessary legal templates.",
    },
    available: {
      title: "Available Templates",
    },
    documentTypes: {
      rentContract: "Rental Agreement",
      employmentContract: "Employment Contract",
      saleContract: "Sales Contract",
      courtClaim: "Court Claim",
      complaint: "Complaint to Government Agencies",
    },
  },

  about: {
    hero: {
      title: "About Our AI Assistant",
      subtitle:
        "Our AI assistant uses advanced natural language processing technologies to provide accurate and fast legal advice.",
    },
    howItWorks: {
      title: "How Does the System Work?",
      processing: {
        title: "Request Processing",
        description: "AI analyzes your question and determines its legal specifics.",
      },
      technologies: {
        title: "Technologies Used",
        description: "Our system is based on GPT, LLM, and other modern neural networks.",
      },
      accuracy: {
        title: "Answer Accuracy",
        description: "AI is trained on legal texts but does not replace a professional lawyer.",
      },
    },
  },

  faq: {
    hero: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to the most popular questions about the LegalAI service.",
    },
    questions: {
      title: "Popular Questions",
      howWorks: {
        question: "How does LegalAI work?",
        answer: "LegalAI uses artificial intelligence to analyze legal questions and draft documents.",
      },
      accuracy: {
        question: "How accurate are the answers?",
        answer: "Our AI is trained on an extensive database but does not replace consultation with a lawyer.",
      },
    },
  },

  profile: {
    hero: {
      title: "Personal Account",
      welcome: "Welcome",
      logoutButton: "Logout",
    },
    sections: {
      title: "Your Data",
      history: {
        title: "Consultation History",
        description: "View your past legal questions and answers.",
      },
      documents: {
        title: "Saved Documents",
        description: "Access to your contracts, applications, and other files.",
      },
      settings: {
        title: "Profile Settings",
        description: "Change personal data, subscription, and notifications.",
      },
    },
    loading: "Loading...",
  },

  chat: {
    title: "Chat with a Lawyer",
    newChat: "New Chat",
    searchChats: "Search chats...",
    tabs: {
      chats: "Chats",
      categories: "Categories",
    },
    categories: {
      family: "Family Law",
      labor: "Labor Law",
      property: "Real Estate",
      consumer: "Consumer Protection",
      auto: "Auto Law",
      documents: "Documents",
    },
    messages: {
      today: "Today",
      yesterday: "Yesterday",
      typing: "typing...",
      read: "Read",
      sent: "Sent",
      popularQuestions: "Popular Questions:",
      inputPlaceholder: "Enter your question...",
      waitingResponse: "Waiting for response...",
      enterToSend: "Press Enter to send, Shift+Enter for a new line",
    },
    quickQuestions: {
      terminateContract: "How to terminate an employment contract?",
      inheritanceDocuments: "What documents are needed for inheritance?",
      refundDefective: "What to do if the seller doesn't refund for a defective product?",
      disputeFine: "How to dispute a traffic fine?",
    },
  },

  supportChat: {
    title: "Support Chat",
    greeting: "Hello! How can I help you?",
    inputPlaceholder: "Enter a message...",
    waitingResponse: "Waiting for response...",
    response: "Thank you for your question. Our specialist will contact you soon.",
  },

  auth: {
    login: {
      title: "Login",
      subtitle: "Sign in to your account to access personal consultations and saved documents",
      formTitle: "Login to LegalAI",
      formSubtitle: "Enter your credentials to access the system",
      username: "Username",
      password: "Password",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      loginButton: "Sign In",
      noAccount: "Don't have an account?",
      register: "Register",
      errors: {
        emptyFields: "Please fill in all fields",
        invalidCredentials: "Invalid username or password",
        generalError: "An error occurred during login",
      },
      success: {
        title: "Registration Successful!",
        message: "Your account has been successfully created. You can now log in to the system.",
      },
    },
    register: {
      title: "Registration",
      subtitle: "Create an account to access all LegalAI features",
      formTitle: "Create Account",
      formSubtitle: "Fill out the form to register in the system",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      agreeTerms: "I agree to the",
      termsLink: "terms of service",
      privacyLink: "privacy policy",
      registerButton: "Register",
      haveAccount: "Already have an account?",
      loginLink: "Login",
      errors: {
        emptyUsername: "Enter a username",
        emptyEmail: "Enter an email",
        invalidEmail: "Enter a valid email",
        emptyPassword: "Enter a password",
        shortPassword: "Password must be at least 8 characters",
        passwordMismatch: "Passwords do not match",
        agreeTerms: "You must agree to the terms",
        generalError: "An error occurred during registration",
      },
    },
    forgotPassword: {
      title: "Password Recovery",
      subtitle: "We will send you instructions to reset your password to the specified email",
      formTitle: "Forgot Password?",
      formSubtitle: "Enter the email you used during registration",
      email: "Email",
      sendButton: "Send Instructions",
      backToLogin: "Back to login page",
      success: {
        title: "Instructions Sent",
        message:
          "We have sent password reset instructions to your address. Please check your email and follow the instructions in the letter.",
        backButton: "Back to login page",
      },
      errors: {
        emptyEmail: "Please enter an email",
        invalidEmail: "Please enter a valid email",
        generalError: "An error occurred during sending",
      },
    },
  },
}

// Словарь всех переводов
export const translations = {
  ru,
  kz,
  en,
}
