import type { Override } from "./overrides";
import type { PageKey } from "../messages";

const KEYS: PageKey[] = ["about", "ecosystem", "iriel", "iapps", "developers", "docs", "privacy", "security", "support", "feedback", "terms", "contact"];

interface Pack {
  nav: [string, string, string, string, string, string, string]; // home about ecosystem developers docs support contact
  skip: string; lang: [string, string, string, string, string, string]; // label rtl ltr script fallback complete
  foot: [string, string, string, string, string, string, string, string, string, string, string, string, string, string, string]; // tagline platform developers resources legal documentation architecture integrations devResources feedback support privacy security terms rights
  home: [string, string, string, string, string, string, string]; // title manifesto ctaPrimary ctaSecondary manifestoTitle entitiesTitle principlesTitle
  tag: [string, string, string];
  dep: [string, string, string, string, string];
  agent: [string, string, string, string, string, string, string, string, string, string, string, string]; // eyebrow intro distinction placeholder send you suggestions remote consent prompt destination send keep local local-only response
  form: [string, string, string, string, string, string, string]; // final message explains that submission is not connected
  pages: string[]; // 12 titles
}

function build(p: Pack): Override {
  const [home, about, ecosystem, developers, docs, support, contact] = p.nav;
  const f = p.foot;
  const pages = Object.fromEntries(KEYS.map((k, i) => [k, { title: p.pages[i] }])) as NonNullable<Override["pages"]>;
  return {
    nav: { home, about, ecosystem, developers, docs, agent: "Agent PRSL-AI", support, contact },
    skip: p.skip,
    language: { label: p.lang[0], rtl: p.lang[1], ltr: p.lang[2], script: p.lang[3], fallback: p.lang[4], complete: p.lang[5] },
    footer: {
      tagline: f[0], platform: f[1], developers: f[2], resources: f[3], legal: f[4], about, ecosystem,
      documentation: f[5], architecture: f[6], integrations: f[7], devResources: f[8], feedback: f[9], support: f[10], contact,
      privacy: f[11], security: f[12], terms: f[13], copyright: `Copyright © 2026 Robert Software Labs. ${f[14]}`,
    },
    home: {
      title: p.home[0], manifesto: p.home[1], tagline: p.tag, ctaPrimary: p.home[2], ctaSecondary: p.home[3],
      manifestoTitle: p.home[4], entitiesTitle: p.home[5], principlesTitle: p.home[6],
      dependencyTitle: p.dep[0], dependencyLines: p.dep.slice(1),
    },
    agent: { eyebrow: p.agent[0], poweredBy: "Powered by Robert Software Labs", intro: p.agent[1], distinctionTitle: p.agent[2], placeholder: p.agent[3], send: p.agent[4], you: p.agent[5], suggestionsLabel: p.agent[6], remoteConsentPrompt: p.agent[7], remoteDestination: p.agent[8], sendRemote: p.agent[9], keepLocal: p.agent[10], localOnly: p.agent[11] },
    form: { name: p.form[0], email: p.form[1], category: p.form[2], message: p.form[3], submit: p.form[4], unavailable: p.form[5], required: p.form[6] },
    pages,
  };
}

export const fr = build({
  nav: ["Accueil", "À propos", "Écosystème", "Développeurs", "Docs", "Assistance", "Contact"],
  skip: "Aller au contenu principal",
  lang: ["Langue", "De droite à gauche", "De gauche à droite", "Écriture", "Traduction complète en cours — contenu affiché en", "Complet"],
  foot: ["Accessibilité, inclusion et sécurité par défaut.", "Plateforme", "Développeurs", "Ressources", "Mentions légales", "Documentation", "Architecture", "Intégrations", "Ressources développeurs", "Avis", "Assistance", "Confidentialité", "Sécurité", "Conditions d’utilisation", "Tous droits réservés."],
  home: ["Accessibilité, inclusion et sécurité par défaut.", "Votre continuité est votre droit. La machine s’adapte à vous.", "Explorer l’écosystème", "Parler à Agent PRSL-AI", "Manifeste", "Entités principales", "Principes architecturaux"],
  tag: ["Confidentialité par défaut", "Local d’abord", "Indépendant des fournisseurs"],
  dep: ["Intelligence sans dépendance", "Le modèle pense.", "L’agent exécute.", "Le Router décide.", "iRiel orchestre."],
  agent: ["Spécialiste de la plateforme", "Posez vos questions sur l’écosystème, le Router, iRiel, les iApps, les langues ou nos principes.", "Agent PRSL-AI n’est pas iRiel", "Demandez à Agent PRSL-AI…", "Envoyer", "Vous", "Questions suggérées", "Je n’ai pas de réponse locale à cette question. Autorisez-vous l’envoi du texte de la question au service d’IA distant ?", "Destination : Lovable AI Gateway, actuellement configuré avec OpenAI GPT-6 Astra. Votre profil, votre mémoire et votre historique ne sont pas inclus.", "Envoyer à l’IA distante", "Ne pas envoyer", "Aucune information n’a été envoyée. Je peux répondre uniquement à partir des sujets disponibles localement."],
  form: ["Nom", "E-mail", "Catégorie", "Message", "Envoyer", "Ce formulaire n'est pas relié à un service d'envoi. Rien n'est envoyé ni stocké. N'y saisissez aucune donnée personnelle ou sensible.", "Obligatoire"],
  pages: ["À propos de Robert Software Labs", "L’écosystème PRSL-AI", "iRiel AI", "iApps", "Développeurs", "Documentation", "Confidentialité", "Sécurité", "Centre d’aide", "Avis", "Conditions d’utilisation", "Contacter Robert Software Labs"],
});

export const de = build({
  nav: ["Start", "Über uns", "Ökosystem", "Entwickler", "Doku", "Support", "Kontakt"],
  skip: "Zum Hauptinhalt springen",
  lang: ["Sprache", "Von rechts nach links", "Von links nach rechts", "Schrift", "Vollständige Übersetzung in Arbeit — Inhalte werden angezeigt auf", "Vollständig"],
  foot: ["Barrierefreiheit, Inklusion und Sicherheit als Standard.", "Plattform", "Entwickler", "Ressourcen", "Rechtliches", "Dokumentation", "Architektur", "Integrationen", "Entwickler-Ressourcen", "Feedback", "Support", "Datenschutz", "Sicherheit", "Nutzungsbedingungen", "Alle Rechte vorbehalten."],
  home: ["Barrierefreiheit, Inklusion und Sicherheit als Standard.", "Ihre Kontinuität ist Ihr Recht. Die Maschine passt sich Ihnen an.", "Ökosystem erkunden", "Mit Agent PRSL-AI sprechen", "Manifest", "Zentrale Entitäten", "Architekturprinzipien"],
  tag: ["Datenschutz als Standard", "Gerät zuerst", "Anbieterunabhängig"],
  dep: ["Intelligenz ohne Abhängigkeit", "Das Modell denkt.", "Der Agent führt aus.", "Der Router entscheidet.", "iRiel orchestriert."],
  agent: ["Plattformspezialist", "Fragen Sie zum Ökosystem, Router, iRiel, den iApps, Sprachen oder unseren Prinzipien.", "Agent PRSL-AI ist nicht iRiel", "Agent PRSL-AI fragen…", "Senden", "Sie", "Vorgeschlagene Fragen", "Ich habe keine lokale Antwort auf diese Frage. Möchten Sie nur den Fragetext an den entfernten KI-Dienst senden?", "Ziel: Lovable AI Gateway, derzeit mit OpenAI GPT-6 Astra konfiguriert. Profil, Gedächtnis und Gesprächsverlauf werden nicht mitgesendet.", "Frage an entfernte KI senden", "Nicht senden", "Es wurden keine Informationen gesendet. Ich kann nur anhand der lokal verfügbaren Themen antworten."],
  form: ["Name", "E-Mail", "Kategorie", "Nachricht", "Senden", "Dieses Formular ist nicht mit einem Übermittlungsdienst verbunden. Es wird nichts gesendet oder gespeichert. Geben Sie hier keine personenbezogenen oder sensiblen Daten ein.", "Pflichtfeld"],
  pages: ["Über Robert Software Labs", "Das PRSL-AI-Ökosystem", "iRiel AI", "iApps", "Entwickler", "Dokumentation", "Datenschutz", "Sicherheit", "Hilfezentrum", "Feedback", "Nutzungsbedingungen", "Kontakt Robert Software Labs"],
});

export const it = build({
  nav: ["Home", "Chi siamo", "Ecosistema", "Sviluppatori", "Documenti", "Supporto", "Contatti"],
  skip: "Vai al contenuto principale",
  lang: ["Lingua", "Da destra a sinistra", "Da sinistra a destra", "Scrittura", "Traduzione completa in corso — contenuti mostrati in", "Completo"],
  foot: ["Accessibilità, inclusione e sicurezza per impostazione predefinita.", "Piattaforma", "Sviluppatori", "Risorse", "Note legali", "Documentazione", "Architettura", "Integrazioni", "Risorse per sviluppatori", "Feedback", "Supporto", "Privacy", "Sicurezza", "Termini di servizio", "Tutti i diritti riservati."],
  home: ["Accessibilità, inclusione e sicurezza per impostazione predefinita.", "La tua continuità è un tuo diritto. La macchina si adatta a te.", "Esplora l’ecosistema", "Parla con Agent PRSL-AI", "Manifesto", "Entità principali", "Principi architetturali"],
  tag: ["Privacy predefinita", "Prima il dispositivo", "Indipendente dai fornitori"],
  dep: ["Intelligenza senza dipendenza", "Il modello pensa.", "L’agente esegue.", "Il Router decide.", "iRiel orchestra."],
  agent: ["Specialista della piattaforma", "Chiedi dell’ecosistema, del Router, di iRiel, delle iApps, delle lingue o dei nostri principi.", "Agent PRSL-AI non è iRiel", "Chiedi ad Agent PRSL-AI…", "Invia", "Tu", "Domande suggerite", "Non ho una risposta locale a questa domanda. Autorizzi l’invio del solo testo della domanda al servizio IA remoto?", "Destinazione: Lovable AI Gateway, attualmente configurato con OpenAI GPT-6 Astra. Profilo, memoria e cronologia delle conversazioni non saranno inclusi.", "Invia la domanda all’IA remota", "Non inviare", "Non è stata inviata alcuna informazione. Posso rispondere solo usando gli argomenti disponibili localmente."],
  form: ["Nome", "E-mail", "Categoria", "Messaggio", "Invia", "Questo modulo non è collegato a un servizio di invio. Non viene inviato né archiviato nulla. Non inserire qui dati personali o sensibili.", "Obbligatorio"],
  pages: ["Chi è Robert Software Labs", "L’ecosistema PRSL-AI", "iRiel AI", "iApps", "Sviluppatori", "Documentazione", "Privacy", "Sicurezza", "Centro assistenza", "Feedback", "Termini di servizio", "Contatta Robert Software Labs"],
});

export const nl = build({
  nav: ["Home", "Over ons", "Ecosysteem", "Ontwikkelaars", "Docs", "Ondersteuning", "Contact"],
  skip: "Naar hoofdinhoud",
  lang: ["Taal", "Van rechts naar links", "Van links naar rechts", "Schrift", "Volledige vertaling in uitvoering — inhoud wordt getoond in", "Volledig"],
  foot: ["Toegankelijkheid, inclusie en veiligheid als standaard.", "Platform", "Ontwikkelaars", "Bronnen", "Juridisch", "Documentatie", "Architectuur", "Integraties", "Bronnen voor ontwikkelaars", "Feedback", "Ondersteuning", "Privacy", "Beveiliging", "Servicevoorwaarden", "Alle rechten voorbehouden."],
  home: ["Toegankelijkheid, inclusie en veiligheid als standaard.", "Uw continuïteit is uw recht. De machine past zich aan u aan.", "Ontdek het ecosysteem", "Praat met Agent PRSL-AI", "Manifest", "Kernentiteiten", "Architectuurprincipes"],
  tag: ["Privacy als standaard", "Apparaat eerst", "Leveranciersonafhankelijk"],
  dep: ["Intelligentie zonder afhankelijkheid", "Het model denkt.", "De agent voert uit.", "De Router beslist.", "iRiel orkestreert."],
  agent: ["Platformspezialist", "Vraag naar het ecosysteem, de Router, iRiel, de iApps, talen of onze principes.", "Agent PRSL-AI is niet iRiel", "Vraag het Agent PRSL-AI…", "Verzenden", "U", "Voorgestelde vragen", "Ik heb geen lokaal antwoord op deze vraag. Geeft u toestemming om alleen de vraagtekst naar de externe AI-dienst te sturen?", "Bestemming: Lovable AI Gateway, momenteel geconfigureerd met OpenAI GPT-6 Astra. Uw profiel, geheugen en gespreksgeschiedenis worden niet meegestuurd.", "Vraag naar externe AI sturen", "Niet verzenden", "Er is geen informatie verzonden. Ik kan alleen antwoorden op basis van lokaal beschikbare onderwerpen."],
  form: ["Naam", "E-mail", "Categorie", "Bericht", "Verzenden", "Dit formulier is niet gekoppeld aan een verzenddienst. Er wordt niets verzonden of opgeslagen. Vul hier geen persoonlijke of gevoelige gegevens in.", "Verplicht"],
  pages: ["Over Robert Software Labs", "Het PRSL-AI-ecosysteem", "iRiel AI", "iApps", "Ontwikkelaars", "Documentatie", "Privacy", "Beveiliging", "Helpcentrum", "Feedback", "Servicevoorwaarden", "Contact Robert Software Labs"],
});

export const ru = build({
  nav: ["Главная", "О нас", "Экосистема", "Разработчикам", "Документация", "Поддержка", "Контакты"],
  skip: "Перейти к основному содержимому",
  lang: ["Язык", "Справа налево", "Слева направо", "Письменность", "Полный перевод в работе — содержимое показано на языке", "Полный"],
  foot: ["Доступность, инклюзивность и безопасность по умолчанию.", "Платформа", "Разработчикам", "Ресурсы", "Правовая информация", "Документация", "Архитектура", "Интеграции", "Ресурсы для разработчиков", "Отзывы", "Поддержка", "Конфиденциальность", "Безопасность", "Условия использования", "Все права защищены."],
  home: ["Доступность, инклюзивность и безопасность по умолчанию.", "Ваша непрерывность — ваше право. Машина подстраивается под вас.", "Изучить экосистему", "Поговорить с Agent PRSL-AI", "Манифест", "Ключевые сущности", "Архитектурные принципы"],
  tag: ["Приватность по умолчанию", "Сначала устройство", "Независимость от провайдеров"],
  dep: ["Интеллект без зависимости", "Модель думает.", "Агент исполняет.", "Router решает.", "iRiel оркестрирует."],
  agent: ["Специалист платформы", "Спросите об экосистеме, Router, iRiel, iApps, языках или наших принципах.", "Agent PRSL-AI — это не iRiel", "Спросите Agent PRSL-AI…", "Отправить", "Вы", "Предлагаемые вопросы", "У меня нет локального ответа на этот вопрос. Разрешаете отправить только текст вопроса во внешний ИИ-сервис?", "Назначение: Lovable AI Gateway, сейчас настроенный на OpenAI GPT-6 Astra. Профиль, память и история разговоров не передаются.", "Отправить вопрос во внешний ИИ", "Не отправлять", "Информация не отправлялась. Я могу отвечать только по темам, доступным локально."],
  form: ["Имя", "Эл. почта", "Категория", "Сообщение", "Отправить", "Эта форма не подключена к службе отправки. Ничего не отправляется и не сохраняется. Не вводите здесь личные или конфиденциальные данные.", "Обязательно"],
  pages: ["О Robert Software Labs", "Экосистема PRSL-AI", "iRiel AI", "iApps", "Разработчикам", "Документация", "Конфиденциальность", "Безопасность", "Центр помощи", "Отзывы", "Условия использования", "Связаться с Robert Software Labs"],
});

export const zhCN = build({
  nav: ["首页", "关于", "生态系统", "开发者", "文档", "支持", "联系"],
  skip: "跳到主要内容",
  lang: ["语言", "从右到左", "从左到右", "文字", "完整翻译进行中 — 当前显示语言：", "完整"],
  foot: ["默认无障碍、包容与安全。", "平台", "开发者", "资源", "法律", "文档", "架构", "集成", "开发者资源", "反馈", "支持", "隐私", "安全", "服务条款", "保留所有权利。"],
  home: ["默认无障碍、包容与安全。", "连续性是你的权利。机器适应你。", "探索生态系统", "与 Agent PRSL-AI 对话", "宣言", "核心实体", "架构原则"],
  tag: ["默认隐私", "设备优先", "不依赖供应商"],
  dep: ["无依赖的智能", "模型负责思考。", "智能体负责执行。", "Router 负责决策。", "iRiel 负责编排。"],
  agent: ["平台专用助手", "询问生态系统、Router、iRiel、iApps、语言或我们的架构原则。", "Agent PRSL-AI 不是 iRiel", "向 Agent PRSL-AI 提问…", "发送", "你", "推荐问题", "本地知识中没有这个问题的答案。是否同意仅将问题文本发送到远程 AI 服务？", "目标：Lovable AI Gateway，目前配置为 OpenAI GPT-6 Astra。不会包含你的个人资料、记忆或对话历史。", "发送问题到远程 AI", "不发送", "没有发送任何信息。我只能根据本次会话中本地可用的主题回答。"],
  form: ["姓名", "电子邮件", "类别", "消息", "提交", "此表单尚未连接提交服务。不会发送或存储任何内容。请勿在此输入个人或敏感信息。", "必填"],
  pages: ["关于 Robert Software Labs", "PRSL-AI 生态系统", "iRiel AI", "iApps", "开发者", "文档", "隐私", "安全", "帮助中心", "反馈", "服务条款", "联系 Robert Software Labs"],
});

export const zhTW = build({
  nav: ["首頁", "關於", "生態系統", "開發者", "文件", "支援", "聯絡"],
  skip: "跳至主要內容",
  lang: ["語言", "由右至左", "由左至右", "文字", "完整翻譯進行中 — 目前顯示語言：", "完整"],
  foot: ["預設無障礙、包容與安全。", "平台", "開發者", "資源", "法律", "文件", "架構", "整合", "開發者資源", "意見回饋", "支援", "隱私", "安全", "服務條款", "保留所有權利。"],
  home: ["預設無障礙、包容與安全。", "連續性是你的權利。機器適應你。", "探索生態系統", "與 Agent PRSL-AI 對話", "宣言", "核心實體", "架構原則"],
  tag: ["預設隱私", "裝置優先", "不依賴供應商"],
  dep: ["無依賴的智慧", "模型負責思考。", "代理負責執行。", "Router 負責決策。", "iRiel 負責編排。"],
  agent: ["平台專用助理", "詢問生態系統、Router、iRiel、iApps、語言或我們的架構原則。", "Agent PRSL-AI 不是 iRiel", "向 Agent PRSL-AI 提問…", "傳送", "你", "建議問題", "本地知識中沒有這個問題的答案。是否同意僅將問題文字傳送到遠端 AI 服務？", "目的地：Lovable AI Gateway，目前設定為 OpenAI GPT-6 Astra。不會包含你的個人資料、記憶或對話紀錄。", "將問題傳送至遠端 AI", "不要傳送", "沒有傳送任何資訊。我只能根據本次工作階段本機可用的主題回答。"],
  form: ["姓名", "電子郵件", "類別", "訊息", "送出", "此表單尚未連接提交服務。不會傳送或儲存任何內容。請勿在此輸入個人或敏感資訊。", "必填"],
  pages: ["關於 Robert Software Labs", "PRSL-AI 生態系統", "iRiel AI", "iApps", "開發者", "文件", "隱私", "安全", "說明中心", "意見回饋", "服務條款", "聯絡 Robert Software Labs"],
});

export const ja = build({
  nav: ["ホーム", "概要", "エコシステム", "開発者", "ドキュメント", "サポート", "お問い合わせ"],
  skip: "メインコンテンツへ移動",
  lang: ["言語", "右から左", "左から右", "文字", "完全翻訳を準備中 — 表示言語：", "完全"],
  foot: ["アクセシビリティ、インクルージョン、セキュリティを標準に。", "プラットフォーム", "開発者", "リソース", "法的情報", "ドキュメント", "アーキテクチャ", "統合", "開発者リソース", "フィードバック", "サポート", "プライバシー", "セキュリティ", "利用規約", "All rights reserved."],
  home: ["アクセシビリティ、インクルージョン、セキュリティを標準に。", "継続性はあなたの権利。機械があなたに合わせます。", "エコシステムを見る", "Agent PRSL-AI と話す", "マニフェスト", "主要エンティティ", "アーキテクチャ原則"],
  tag: ["プライバシー標準", "デバイス優先", "プロバイダー非依存"],
  dep: ["依存のない知能", "モデルが考える。", "エージェントが実行する。", "Router が決定する。", "iRiel が統括する。"],
  agent: ["プラットフォーム専門アシスタント", "エコシステム、Router、iRiel、iApps、言語、設計原則について質問できます。", "Agent PRSL-AI は iRiel ではありません", "Agent PRSL-AI に質問…", "送信", "あなた", "おすすめの質問", "この質問へのローカルな回答がありません。質問文のみをリモート AI サービスに送信することを許可しますか？", "送信先：Lovable AI Gateway（現在 OpenAI GPT-6 Astra を設定）。プロフィール、メモリ、会話履歴は含まれません。", "リモート AI に質問を送信", "送信しない", "情報は送信されていません。このセッションでローカルに利用できるトピックのみ回答できます。"],
  form: ["お名前", "メール", "カテゴリ", "メッセージ", "送信", "このフォームは送信サービスに接続されていません。何も送信・保存されません。個人情報や機密情報を入力しないでください。", "必須"],
  pages: ["Robert Software Labs について", "PRSL-AI エコシステム", "iRiel AI", "iApps", "開発者", "ドキュメント", "プライバシー", "セキュリティ", "ヘルプセンター", "フィードバック", "利用規約", "Robert Software Labs へのお問い合わせ"],
});

export const ko = build({
  nav: ["홈", "소개", "생태계", "개발자", "문서", "지원", "문의"],
  skip: "본문으로 건너뛰기",
  lang: ["언어", "오른쪽에서 왼쪽", "왼쪽에서 오른쪽", "문자", "전체 번역 진행 중 — 표시 언어:", "완료"],
  foot: ["기본값으로 접근성, 포용성, 보안을.", "플랫폼", "개발자", "리소스", "법적 고지", "문서", "아키텍처", "통합", "개발자 리소스", "피드백", "지원", "개인정보 보호", "보안", "서비스 약관", "All rights reserved."],
  home: ["기본값으로 접근성, 포용성, 보안을.", "연속성은 당신의 권리입니다. 기계가 당신에게 맞춥니다.", "생태계 살펴보기", "Agent PRSL-AI와 대화", "선언문", "핵심 엔티티", "아키텍처 원칙"],
  tag: ["기본 개인정보 보호", "기기 우선", "공급자 독립"],
  dep: ["종속 없는 지능", "모델은 생각합니다.", "에이전트는 실행합니다.", "Router는 결정합니다.", "iRiel은 조율합니다."],
  agent: ["플랫폼 전문 도우미", "생태계, Router, iRiel, iApps, 언어 또는 아키텍처 원칙에 대해 물어보세요.", "Agent PRSL-AI는 iRiel이 아닙니다", "Agent PRSL-AI에게 질문…", "보내기", "나", "추천 질문", "이 질문에 대한 로컬 답변이 없습니다. 질문 텍스트만 원격 AI 서비스로 전송하도록 허용하시겠습니까?", "대상: Lovable AI Gateway, 현재 OpenAI GPT-6 Astra로 구성됨. 프로필, 메모리 및 대화 기록은 포함되지 않습니다.", "원격 AI로 질문 보내기", "보내지 않기", "정보는 전송되지 않았습니다. 이 세션에서 로컬로 사용할 수 있는 주제만 답변할 수 있습니다."],
  form: ["이름", "이메일", "분류", "메시지", "제출", "이 양식은 제출 서비스에 연결되어 있지 않습니다. 어떤 내용도 전송되거나 저장되지 않습니다. 개인 정보나 민감한 정보를 입력하지 마세요.", "필수"],
  pages: ["Robert Software Labs 소개", "PRSL-AI 생태계", "iRiel AI", "iApps", "개발자", "문서", "개인정보 보호", "보안", "도움말 센터", "피드백", "서비스 약관", "Robert Software Labs 문의"],
});

export const hi = build({
  nav: ["होम", "परिचय", "इकोसिस्टम", "डेवलपर्स", "दस्तावेज़", "सहायता", "संपर्क"],
  skip: "मुख्य सामग्री पर जाएँ",
  lang: ["भाषा", "दाएँ से बाएँ", "बाएँ से दाएँ", "लिपि", "पूर्ण अनुवाद प्रगति पर — सामग्री इस भाषा में दिखाई जा रही है:", "पूर्ण"],
  foot: ["डिफ़ॉल्ट रूप से सुलभता, समावेशन और सुरक्षा।", "प्लेटफ़ॉर्म", "डेवलपर्स", "संसाधन", "कानूनी", "दस्तावेज़ीकरण", "आर्किटेक्चर", "इंटीग्रेशन", "डेवलपर संसाधन", "प्रतिक्रिया", "सहायता", "गोपनीयता", "सुरक्षा", "सेवा की शर्तें", "सर्वाधिकार सुरक्षित।"],
  home: ["डिफ़ॉल्ट रूप से सुलभता, समावेशन और सुरक्षा।", "आपकी निरंतरता आपका अधिकार है। मशीन आपके अनुसार ढलती है।", "इकोसिस्टम देखें", "Agent PRSL-AI से बात करें", "घोषणापत्र", "मुख्य इकाइयाँ", "आर्किटेक्चर सिद्धांत"],
  tag: ["डिफ़ॉल्ट गोपनीयता", "डिवाइस पहले", "प्रदाता-स्वतंत्र"],
  dep: ["निर्भरता रहित बुद्धिमत्ता", "मॉडल सोचता है।", "एजेंट निष्पादित करता है।", "Router निर्णय लेता है।", "iRiel समन्वय करता है।"],
  agent: ["प्लेटफ़ॉर्म विशेषज्ञ", "इकोसिस्टम, Router, iRiel, iApps, भाषाओं या हमारे सिद्धांतों के बारे में पूछें।", "Agent PRSL-AI, iRiel नहीं है", "Agent PRSL-AI से पूछें…", "भेजें", "आप", "सुझाए गए प्रश्न", "मेरे पास इस प्रश्न का स्थानीय उत्तर नहीं है। क्या आप केवल प्रश्न का पाठ दूरस्थ AI सेवा को भेजने की अनुमति देते हैं?", "गंतव्य: Lovable AI Gateway, वर्तमान में OpenAI GPT-6 Astra के साथ कॉन्फ़िगर किया गया। आपकी प्रोफ़ाइल, मेमोरी और बातचीत का इतिहास शामिल नहीं होगा।", "दूरस्थ AI को प्रश्न भेजें", "न भेजें", "कोई जानकारी नहीं भेजी गई। मैं केवल इस सत्र में स्थानीय रूप से उपलब्ध विषयों के आधार पर उत्तर दे सकता हूँ।"],
  form: ["नाम", "ईमेल", "श्रेणी", "संदेश", "भेजें", "यह फ़ॉर्म किसी सबमिशन सेवा से जुड़ा नहीं है। कुछ भी भेजा या संग्रहीत नहीं होता। यहाँ व्यक्तिगत या संवेदनशील जानकारी दर्ज न करें।", "आवश्यक"],
  pages: ["Robert Software Labs के बारे में", "PRSL-AI इकोसिस्टम", "iRiel AI", "iApps", "डेवलपर्स", "दस्तावेज़ीकरण", "गोपनीयता", "सुरक्षा", "सहायता केंद्र", "प्रतिक्रिया", "सेवा की शर्तें", "Robert Software Labs से संपर्क"],
});

export const enGB: Override = {
  language: { fallback: "Showing content in" },
  footer: { tagline: "Accessibility, inclusion and security by default." },
};
