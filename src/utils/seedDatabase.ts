// @ts-nocheck
import type { App, User, Review, NewsPost, Consultation, Download, RegionStat } from '../types';
import { encodePassword } from './validators';

export const seedApps: App[] = [
  {
    id: 'app-001',
    slug: 'exsify-pos',
    name_en: 'Exsify POS',
    name_ar: 'إكسيفي نقاط البيع',
    description_en: 'A powerful point-of-sale system designed for retail businesses in Africa and the Middle East. Features inventory management, sales analytics, multi-currency support, and offline capability.',
    description_ar: 'نظام نقاط بيع قوي مصمم للشركات التجارية في أفريقيا والشرق الأوسط. يتميز بإدارة المخزون وتحليلات المبيعات ودعم العملات المتعددة والقدرة على العمل دون اتصال.',
    features_en: [
      'Real-time inventory tracking',
      'Multi-currency transactions',
      'Offline mode support',
      'Sales analytics dashboard',
      'Customer loyalty program',
      'Receipt printing',
      'Barcode scanning',
      'Employee management'
    ],
    features_ar: [
      'تتبع المخزون في الوقت الفعلي',
      'معاملات متعددة العملات',
      'دعم وضع عدم الاتصال',
      'لوحة تحليلات المبيعات',
      'برنامج ولاء العملاء',
      'طباعة الإيصالات',
      'مسح الباركود',
      'إدارة الموظفين'
    ],
    category: 'Retail',
    price_usd: 49.99,
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200',
    downloadCount: 15420,
    rating: 4.8,
    totalReviews: 342,
    regionsAvailable: ['Kenya', 'Nigeria', 'Saudi Arabia', 'UAE', 'Egypt', 'South Africa'],
    status: 'active',
    featured: true,
    downloadUrl: ''
  },
  {
    id: 'app-002',
    slug: 'exsify-hrms',
    name_en: 'Exsify HRMS',
    name_ar: 'إكسيفي إدارة الموارد البشرية',
    description_en: 'Comprehensive human resource management system with payroll, attendance tracking, performance reviews, and recruitment tools tailored for regional labor laws.',
    description_ar: 'نظام شامل لإدارة الموارد البشرية مع الرواتب وتتبع الحضور وتقييمات الأداء وأدوات التوظيف المصممة وفقاً لقوانين العمل المحلية.',
    features_en: [
      'Employee database management',
      'Payroll processing',
      'Attendance & leave tracking',
      'Performance evaluation',
      'Recruitment portal',
      'Document management',
      'Compliance reporting',
      'Mobile app access'
    ],
    features_ar: [
      'إدارة قاعدة بيانات الموظفين',
      'معالجة الرواتب',
      'تتبع الحضور والإجازات',
      'تقييم الأداء',
      'بوابة التوظيف',
      'إدارة المستندات',
      'تقارير الامتثال',
      'الوصول عبر تطبيق الجوال'
    ],
    category: 'HR',
    price_usd: 79.99,
    screenshots: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
    downloadCount: 8930,
    rating: 4.6,
    totalReviews: 218,
    regionsAvailable: ['Saudi Arabia', 'UAE', 'Qatar', 'Kenya', 'Nigeria', 'Egypt'],
    status: 'active',
    featured: true,
    downloadUrl: ""
  },
  {
    id: 'app-003',
    slug: 'exsify-inventory',
    name_en: 'Exsify Inventory',
    name_ar: 'إكسيفي المخزون',
    description_en: 'Smart inventory management solution with AI-powered forecasting, multi-location support, and seamless integration with popular e-commerce platforms.',
    description_ar: 'حل ذكي لإدارة المخزون مع التنبؤ المدعوم بالذكاء الاصطناعي ودعم المواقع المتعددة والتكامل السلس مع منصات التجارة الإلكترونية الشائعة.',
    features_en: [
      'AI demand forecasting',
      'Multi-warehouse management',
      'Barcode & QR scanning',
      'Stock level alerts',
      'Supplier management',
      'Purchase order automation',
      'E-commerce integration',
      'Real-time sync'
    ],
    features_ar: [
      'التنبؤ بالطلب بالذكاء الاصطناعي',
      'إدارة المستودعات المتعددة',
      'مسح الباركود وQR',
      'تنبيهات مستوى المخزون',
      'إدارة الموردين',
      'أتمتة أوامر الشراء',
      'تكامل التجارة الإلكترونية',
      'المزامنة في الوقت الفعلي'
    ],
    category: 'Inventory',
    price_usd: 59.99,
    screenshots: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200',
    downloadCount: 11250,
    rating: 4.7,
    totalReviews: 289,
    regionsAvailable: ['Kenya', 'Nigeria', 'South Africa', 'UAE', 'Saudi Arabia', 'Egypt'],
    status: 'active',
    featured: true,
    downloadUrl: ""
  },
  {
    id: 'app-004',
    slug: 'exsify-accounting',
    name_en: 'Exsify Accounting',
    name_ar: 'إكسيفي المحاسبة',
    description_en: 'Full-featured accounting software with VAT compliance, multi-currency support, automated invoicing, and financial reporting for businesses of all sizes.',
    description_ar: 'برنامج محاسبة كامل الميزات مع الامتثال لضريبة القيمة المضافة ودعم العملات المتعددة والفوترة الآلية والتقارير المالية للشركات من جميع الأحجام.',
    features_en: [
      'Double-entry bookkeeping',
      'VAT & tax compliance',
      'Multi-currency accounting',
      'Automated invoicing',
      'Bank reconciliation',
      'Financial reports',
      'Expense tracking',
      'Budget management'
    ],
    features_ar: [
      'الحسابات المزدوجة',
      'الامتثال لضريبة القيمة المضافة والضرائب',
      'المحاسبة متعددة العملات',
      'الفوترة الآلية',
      'التوفيق البنكي',
      'التقارير المالية',
      'تتبع المصروفات',
      'إدارة الميزانية'
    ],
    category: 'Finance',
    price_usd: 69.99,
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200',
    downloadCount: 7650,
    rating: 4.5,
    totalReviews: 176,
    regionsAvailable: ['Saudi Arabia', 'UAE', 'Kenya', 'Nigeria', 'Egypt', 'Morocco'],
    status: 'active',
    featured: false,
    downloadUrl: ""
  },
  {
    id: 'app-005',
    slug: 'exsify-crm',
    name_en: 'Exsify CRM',
    name_ar: 'إكسيفي إدارة علاقات العملاء',
    description_en: 'Customer relationship management platform with sales pipeline, marketing automation, customer support ticketing, and detailed analytics.',
    description_ar: 'منصة إدارة علاقات العملاء مع خط مبيعات وأتمتة التسويق وتذاكر دعم العملاء وتحليلات مفصلة.',
    features_en: [
      'Contact & lead management',
      'Sales pipeline tracking',
      'Email marketing automation',
      'Support ticketing system',
      'Task & activity management',
      'Custom dashboards',
      'Mobile CRM app',
      'Third-party integrations'
    ],
    features_ar: [
      'إدارة جهات الاتصال والعملاء المحتملين',
      'تتبع خط المبيعات',
      'أتمتة التسويق عبر البريد الإلكتروني',
      'نظام تذاكر الدعم',
      'إدارة المهام والأنشطة',
      'لوحات معلومات مخصصة',
      'تطبيق CRM للجوال',
      'تكاملات الطرف الثالث'
    ],
    category: 'Sales',
    price_usd: 54.99,
    screenshots: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200',
    downloadCount: 9870,
    rating: 4.6,
    totalReviews: 234,
    regionsAvailable: ['Nigeria', 'Kenya', 'South Africa', 'UAE', 'Saudi Arabia', 'Egypt'],
    status: 'active',
    featured: true,
    downloadUrl: ""
  },
  {
    id: 'app-006',
    slug: 'exsify-school',
    name_en: 'Exsify School Manager',
    name_ar: 'إكسيفي إدارة المدارس',
    description_en: 'Complete school management system with student information, grade management, attendance tracking, parent portal, and fee collection.',
    description_ar: 'نظام كامل لإدارة المدارس مع معلومات الطلاب وإدارة الدرجات وتتبع الحضور وبوابة أولياء الأمور وتحصيل الرسوم.',
    features_en: [
      'Student information system',
      'Gradebook & report cards',
      'Attendance tracking',
      'Parent communication portal',
      'Fee management',
      'Timetable scheduling',
      'Library management',
      'Transport tracking'
    ],
    features_ar: [
      'نظام معلومات الطلاب',
      'سجل الدرجات وبطاقات التقارير',
      'تتبع الحضور',
      'بوابة التواصل مع أولياء الأمور',
      'إدارة الرسوم',
      'جدولة الجدول الزمني',
      'إدارة المكتبة',
      'تتبع النقل'
    ],
    category: 'Education',
    price_usd: 89.99,
    screenshots: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      'https://images.unsplash.com/photo-1427504740708-5240de61dede?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200',
    downloadCount: 5430,
    rating: 4.7,
    totalReviews: 156,
    regionsAvailable: ['Kenya', 'Nigeria', 'Egypt', 'Saudi Arabia', 'UAE', 'South Africa'],
    status: 'active',
    featured: false,
    downloadUrl: ""
  },
  {
    id: 'app-007',
    slug: 'exsify-clinic',
    name_en: 'Exsify Clinic',
    name_ar: 'إكسيفي العيادة',
    description_en: 'Healthcare management solution for clinics with patient records, appointment scheduling, billing, prescription management, and lab integration.',
    description_ar: 'حل إدارة الرعاية الصحية للعيادات مع سجلات المرضى وجدولة المواعيد والفوترة وإدارة الوصفات الطبية وتكامل المختبر.',
    features_en: [
      'Electronic health records',
      'Appointment scheduling',
      'Patient billing',
      'Prescription management',
      'Lab integration',
      'Insurance claims',
      'Telemedicine support',
      'Reports & analytics'
    ],
    features_ar: [
      'السجلات الصحية الإلكترونية',
      'جدولة المواعيد',
      'فوترة المرضى',
      'إدارة الوصفات الطبية',
      'تكامل المختبر',
      'مطالبات التأمين',
      'دعم الطب عن بعد',
      'التقارير والتحليلات'
    ],
    category: 'Healthcare',
    price_usd: 99.99,
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200',
    downloadCount: 3210,
    rating: 4.8,
    totalReviews: 98,
    regionsAvailable: ['Saudi Arabia', 'UAE', 'Egypt', 'Kenya', 'Nigeria', 'South Africa'],
    status: 'active',
    featured: true,
    downloadUrl: ""
  },
  {
    id: 'app-008',
    slug: 'exsify-analytics',
    name_en: 'Exsify Analytics',
    name_ar: 'إكسيفي التحليلات',
    description_en: 'Business intelligence and analytics platform with data visualization, predictive analytics, custom reports, and real-time dashboards.',
    description_ar: 'منصة ذكاء الأعمال والتحليلات مع تصور البيانات والتحليلات التنبؤية والتقارير المخصصة ولوحات المعلومات في الوقت الفعلي.',
    features_en: [
      'Interactive dashboards',
      'Data visualization',
      'Predictive analytics',
      'Custom report builder',
      'Real-time data sync',
      'KPI tracking',
      'Data export',
      'API access'
    ],
    features_ar: [
      'لوحات معلومات تفاعلية',
      'تصور البيانات',
      'التحليلات التنبؤية',
      'منشئ التقارير المخصصة',
      'مزامنة البيانات في الوقت الفعلي',
      'تتبع مؤشرات الأداء الرئيسية',
      'تصدير البيانات',
      'الوصول إلى API'
    ],
    category: 'Analytics',
    price_usd: 119.99,
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800'
    ],
    icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
    downloadCount: 4560,
    rating: 4.5,
    totalReviews: 132,
    regionsAvailable: ['UAE', 'Saudi Arabia', 'Nigeria', 'Kenya', 'South Africa', 'Egypt'],
    status: 'active',
    featured: false,
    downloadUrl: ""
  }
];

export const seedUsers: User[] = [
  {
    id: 'user-admin-001',
    fullName: 'System Administrator',
    email: 'admin@exsify.com',
    password: encodePassword('Admin123!'),
    role: 'admin',
    country: 'Saudi Arabia',
    region: 'Riyadh',
    currency: 'SAR',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-001',
    fullName: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'Egypt',
    region: 'Cairo',
    currency: 'USD',
    createdAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'user-002',
    fullName: 'Fatima Al-Rashid',
    email: 'fatima@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'Saudi Arabia',
    region: 'Jeddah',
    currency: 'SAR',
    createdAt: '2024-02-20T14:45:00Z'
  },
  {
    id: 'user-003',
    fullName: 'John Kamau',
    email: 'john@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'Kenya',
    region: 'Nairobi',
    currency: 'KES',
    createdAt: '2024-03-01T09:15:00Z'
  },
  {
    id: 'user-004',
    fullName: 'Amina Ibrahim',
    email: 'amina@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'Nigeria',
    region: 'Lagos',
    currency: 'USD',
    createdAt: '2024-03-10T16:20:00Z'
  },
  {
    id: 'user-005',
    fullName: 'Omar Al-Farsi',
    email: 'omar@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'UAE',
    region: 'Dubai',
    currency: 'USD',
    createdAt: '2024-03-15T11:00:00Z'
  },
  {
    id: 'user-006',
    fullName: 'Grace Odhiambo',
    email: 'grace@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'Kenya',
    region: 'Mombasa',
    currency: 'KES',
    createdAt: '2024-03-18T12:00:00Z'
  },
  {
    id: 'user-007',
    fullName: 'Peter Njoroge',
    email: 'peter@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'Kenya',
    region: 'Nakuru',
    currency: 'KES',
    createdAt: '2024-03-20T08:30:00Z'
  },
  {
    id: 'user-008',
    fullName: 'Wanjiku Mwangi',
    email: 'wanjiku@example.com',
    password: encodePassword('Password123!'),
    role: 'customer',
    country: 'Kenya',
    region: 'Kiambu',
    currency: 'KES',
    createdAt: '2024-03-22T14:15:00Z'
  }
];

export const seedReviews: Review[] = [
  {
    id: 'review-001',
    appId: 'app-001',
    userId: 'user-001',
    userName: 'Ahmed Hassan',
    userCountry: 'Egypt',
    rating: 5,
    text_en: 'Excellent POS system! The offline mode is a game-changer for our retail stores.',
    text_ar: 'نظام نقاط بيع ممتاز! وضع عدم الاتصال يغير قواعد اللعبة لمتاجرنا.',
    status: 'published',
    verified: true, featured: false, approved: true, createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'review-002',
    appId: 'app-001',
    userId: 'user-002',
    userName: 'Fatima Al-Rashid',
    userCountry: 'Saudi Arabia',
    rating: 4,
    text_en: 'Great features, but could use more Arabic language support in reports.',
    text_ar: 'ميزات رائعة، لكن يمكن استخدام المزيد من دعم اللغة العربية في التقارير.',
    status: 'published',
    verified: true, featured: false, approved: true, createdAt: '2024-03-05T14:30:00Z'
  },
  {
    id: 'review-003',
    appId: 'app-002',
    userId: 'user-003',
    userName: 'John Kamau',
    userCountry: 'Kenya',
    rating: 5,
    text_en: 'The HRMS has transformed how we manage our team. Payroll is now seamless!',
    text_ar: 'لقد حول نظام إدارة الموارد البشرية طريقة إدارتنا لفريقنا. الرواتب الآن سلسة!',
    status: 'published',
    verified: true, featured: false, approved: true, createdAt: '2024-03-10T09:45:00Z'
  },
  {
    id: 'review-004',
    appId: 'app-003',
    userId: 'user-004',
    userName: 'Amina Ibrahim',
    userCountry: 'Nigeria',
    rating: 5,
    text_en: 'AI forecasting is incredibly accurate. Reduced our stockouts by 80%!',
    text_ar: 'التنبؤ بالذكاء الاصطناعي دقيق للغاية. قلل من نفاد المخزون لدينا بنسبة 80٪!',
    status: 'published',
    verified: true, featured: false, approved: true, createdAt: '2024-03-12T16:20:00Z'
  },
  {
    id: 'review-005',
    appId: 'app-005',
    userId: 'user-005',
    userName: 'Omar Al-Farsi',
    userCountry: 'UAE',
    rating: 4,
    text_en: 'Solid CRM with great automation features. Support team is responsive.',
    text_ar: 'CRM قوي مع ميزات أتمتة رائعة. فريق الدعم متجاوب.',
    status: 'published',
    verified: true, featured: false, approved: true, createdAt: '2024-03-15T11:30:00Z'
  },
  {
    id: 'review-006',
    appId: 'app-007',
    userId: 'user-002',
    userName: 'Fatima Al-Rashid',
    userCountry: 'Saudi Arabia',
    rating: 5,
    text_en: 'Perfect for our clinic. The telemedicine feature has been invaluable.',
    text_ar: 'مثالي لعيادتنا. كانت ميزة الطب عن بعد لا تقدر بثمن.',
    status: 'pending',
    verified: true, featured: false, approved: true, createdAt: '2024-03-18T13:00:00Z'
  },
  {
    id: 'review-007',
    appId: 'app-004',
    userId: 'user-001',
    userName: 'Ahmed Hassan',
    userCountry: 'Egypt',
    rating: 4,
    text_en: 'Good accounting software. VAT compliance for Egypt works perfectly.',
    text_ar: 'برنامج محاسبة جيد. الامتثال لضريبة القيمة المضافة لمصر يعمل بشكل مثالي.',
    status: 'pending',
    verified: true, featured: false, approved: true, createdAt: '2024-03-20T10:15:00Z'
  }
];

export const seedNews: NewsPost[] = [
  {
    id: 'news-001',
    title_en: 'Exsify POS Reaches 15,000 Downloads Milestone',
    title_ar: 'إكسيفي POS يصل إلى علامة 15,000 تحميل',
    content_en: 'We are thrilled to announce that Exsify POS has been downloaded over 15,000 times across Africa and the Middle East. Thank you to all our loyal customers for trusting us with your business operations.',
    content_ar: 'يسعدنا أن نعلن أن Exsify POS تم تحميله أكثر من 15,000 مرة في جميع أنحاء أفريقيا والشرق الأوسط. شكراً لجميع عملائنا المخلصين على ثقتهم بنا في عمليات أعمالهم.',
    category: 'Company News',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    publishedAt: '2024-03-15T00:00:00Z',
    featured: true
  },
  {
    id: 'news-002',
    title_en: 'New AI Features Coming to Exsify Inventory',
    title_ar: 'ميزات الذكاء الاصطناعي الجديدة قادمة إلى إكسيفي المخزون',
    content_en: 'Our development team is working on advanced AI capabilities for demand forecasting and automatic reordering. Stay tuned for the biggest update yet!',
    content_ar: 'يعمل فريق التطوير لدينا على قدرات الذكاء الاصطناعي المتقدمة للتنبؤ بالطلب وإعادة الطلب التلقائي. ترقبوا أكبر تحديث حتى الآن!',
    category: 'Product Update',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    publishedAt: '2024-03-10T00:00:00Z',
    featured: false
  },
  {
    id: 'news-003',
    title_en: 'Exsify Expands to North African Markets',
    title_ar: 'إكسيفي تتوسع إلى أسواق شمال أفريقيا',
    content_en: 'We are excited to announce our expansion into Morocco, Tunisia, and Algeria. Localized versions of our software suite will be available starting next month.',
    content_ar: 'يسعدنا الإعلان عن توسعنا إلى المغرب وتونس والجزائر. ستتوفر النسخ المترجمة من مجموعة برامجنا بدءاً من الشهر المقبل.',
    category: 'Company News',
    imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
    publishedAt: '2024-03-05T00:00:00Z',
    featured: true
  },
  {
    id: 'news-004',
    title_en: 'Partnership with Leading Payment Providers',
    title_ar: 'شراكة مع مزودي الدفع الرائدين',
    content_en: 'Exsify has partnered with major payment gateways across the region to provide seamless payment processing for all our customers.',
    content_ar: 'شاركت Exsify مع بوابات الدفع الرئيسية في جميع أنحاء المنطقة لتوفير معالجة دفع سلسة لجميع عملائنا.',
    category: 'Partnership',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    publishedAt: '2024-02-28T00:00:00Z',
    featured: false
  }
];

export const seedConsultations: Consultation[] = [
  {
    id: 'consult-001',
    fullName: 'Mohammed Al-Sayed',
    email: 'mohammed@retailstore.com',
    phone: '+966501234567',
    company: 'Al-Sayed Retail',
    serviceInterest: 'Exsify POS',
    projectDetails: 'Interested in implementing Exsify POS across our 5 store locations in Riyadh. Need a demo and pricing information.',
    budget: '$5k-$20k',
    country: 'Saudi Arabia',
    status: 'new',
    submittedAt: '2024-03-18T09:00:00Z'
  },
  {
    id: 'consult-002',
    fullName: 'Sarah Ochieng',
    email: 'sarah@nairobitech.com',
    phone: '+254712345678',
    company: 'Nairobi Tech Solutions',
    serviceInterest: 'Exsify HRMS',
    projectDetails: 'Looking for an HRMS solution for our growing team of 50+ employees. Would like to schedule a consultation.',
    budget: '$20k+',
    country: 'Kenya',
    status: 'contacted',
    submittedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: 'consult-003',
    fullName: 'Youssef Benali',
    email: 'youssef@casablancatrading.ma',
    phone: '+212612345678',
    company: 'Casablanca Trading',
    serviceInterest: 'Exsify Inventory',
    projectDetails: 'Need inventory management solution with multi-warehouse support for our operations in Morocco.',
    budget: '$5k-$20k',
    country: 'Morocco',
    status: 'new',
    submittedAt: '2024-03-20T11:15:00Z'
  },
  {
    id: 'consult-004',
    fullName: 'Aisha Patel',
    email: 'aisha@dubaiclinic.ae',
    phone: '+971501234567',
    company: 'Dubai Medical Clinic',
    serviceInterest: 'Exsify Clinic',
    projectDetails: 'Interested in Exsify Clinic for our healthcare facility. Need to understand integration capabilities with existing systems.',
    budget: '$20k+',
    country: 'UAE',
    status: 'new',
    submittedAt: '2024-03-21T16:45:00Z'
  },
  {
    id: 'consult-005',
    fullName: 'Kwame Asante',
    email: 'kwame@accrafintech.com',
    phone: '+233201234567',
    company: 'Accra FinTech Ltd',
    serviceInterest: 'Exsify Accounting',
    projectDetails: 'Looking for accounting software with VAT compliance for Ghana. Need multi-currency support.',
    budget: '<$5k',
    country: 'Ghana',
    status: 'closed',
    submittedAt: '2024-03-10T08:30:00Z'
  }
];

export const seedDownloads: Download[] = [
  { id: 'dl-001', appId: 'app-001', userId: 'user-001', downloadedAt: '2024-03-01T10:00:00Z' },
  { id: 'dl-002', appId: 'app-002', userId: 'user-003', downloadedAt: '2024-03-05T14:30:00Z' },
  { id: 'dl-003', appId: 'app-003', userId: 'user-004', downloadedAt: '2024-03-10T09:15:00Z' },
  { id: 'dl-004', appId: 'app-005', userId: 'user-005', downloadedAt: '2024-03-12T11:30:00Z' },
  { id: 'dl-005', appId: 'app-001', userId: 'user-002', downloadedAt: '2024-03-15T13:00:00Z' }
];

export const seedRegionStats: RegionStat[] = [
  { country: 'Kenya', countryCode: 'KE', userCount: 2400, downloadCount: 8900 },
  { country: 'Tanzania', countryCode: 'TZ', userCount: 1500, downloadCount: 5200 },
  { country: 'Uganda', countryCode: 'UG', userCount: 1300, downloadCount: 4800 },
  { country: 'Somalia', countryCode: 'SO', userCount: 700, downloadCount: 2100 },
  { country: 'Djibouti', countryCode: 'DJ', userCount: 500, downloadCount: 1500 },
  { country: 'Ethiopia', countryCode: 'ET', userCount: 1600, downloadCount: 5800 },
  { country: 'Rwanda', countryCode: 'RW', userCount: 900, downloadCount: 3200 },
  { country: 'Saudi Arabia', countryCode: 'SA', userCount: 3200, downloadCount: 12500 },
  { country: 'UAE', countryCode: 'AE', userCount: 2800, downloadCount: 9800 },
  { country: 'Egypt', countryCode: 'EG', userCount: 2100, downloadCount: 7600 },
  { country: 'Nigeria', countryCode: 'NG', userCount: 3100, downloadCount: 11200 },
  { country: 'South Africa', countryCode: 'ZA', userCount: 1800, downloadCount: 6500 },
  { country: 'Qatar', countryCode: 'QA', userCount: 1200, downloadCount: 4100 },
  { country: 'Morocco', countryCode: 'MA', userCount: 1400, downloadCount: 4700 },
  { country: 'Oman', countryCode: 'OM', userCount: 800, downloadCount: 2800 },
  { country: 'Bahrain', countryCode: 'BH', userCount: 600, downloadCount: 1900 }
];

export function seedDatabase(): void {
  if (typeof localStorage === 'undefined') return;
  if (!localStorage.getItem('exsify_apps')) {
    localStorage.setItem('exsify_apps', JSON.stringify(seedApps));
  }
  if (!localStorage.getItem('exsify_users')) {
    localStorage.setItem('exsify_users', JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem('exsify_reviews')) {
    localStorage.setItem('exsify_reviews', JSON.stringify(seedReviews));
  }
  if (!localStorage.getItem('exsify_news')) {
    localStorage.setItem('exsify_news', JSON.stringify(seedNews));
  }
  if (!localStorage.getItem('exsify_consultations')) {
    localStorage.setItem('exsify_consultations', JSON.stringify(seedConsultations));
  }
  if (!localStorage.getItem('exsify_downloads')) {
    localStorage.setItem('exsify_downloads', JSON.stringify(seedDownloads));
  }
  if (!localStorage.getItem('exsify_region_stats')) {
    localStorage.setItem('exsify_region_stats', JSON.stringify(seedRegionStats));
  }

  // Migration: ensure legacy apps have store download URLs
  try {
    const appsRaw = localStorage.getItem('exsify_apps');
    if (appsRaw) {
      const apps = JSON.parse(appsRaw) as App[];
      let changed = false;
      for (const app of apps) {
        if (!app.playStoreUrl) {
          app.playStoreUrl = `https://play.google.com/store/apps/details?id=com.exsify.${app.slug}`;
          changed = true;
        }
        if (!app.appStoreUrl) {
          app.appStoreUrl = `https://apps.apple.com/app/exsify-${app.slug}/id0000000000`;
          changed = true;
        }
        if (!app.desktopUrl) {
          app.desktopUrl = `https://exsify.com/downloads/${app.slug}-setup.exe`;
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem('exsify_apps', JSON.stringify(apps));
      }
    }
  } catch {
    // ignore migration errors
  }

  // Migration: ensure legacy users have a region so county/region features work
  try {
    const usersRaw = localStorage.getItem('exsify_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw) as User[];
      const defaultRegion: Record<string, string> = {
        'Saudi Arabia': 'Riyadh',
        'UAE': 'Dubai',
        'Egypt': 'Cairo',
        'Nigeria': 'Lagos',
        'Kenya': 'Nairobi',
        'South Africa': 'Johannesburg',
        'Qatar': 'Doha',
        'Morocco': 'Casablanca',
        'Tunisia': 'Tunis',
        'Algeria': 'Algiers',
        'Jordan': 'Amman',
        'Kuwait': 'Kuwait City',
        'Bahrain': 'Manama',
        'Oman': 'Muscat'
      };
      let changed = false;
      for (const user of users) {
        if (!user.region && defaultRegion[user.country]) {
          user.region = defaultRegion[user.country];
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem('exsify_users', JSON.stringify(users));
      }
    }
  } catch {
    // ignore migration errors
  }
}

export function resetDatabase(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('exsify_apps', JSON.stringify(seedApps));
  localStorage.setItem('exsify_users', JSON.stringify(seedUsers));
  localStorage.setItem('exsify_reviews', JSON.stringify(seedReviews));
  localStorage.setItem('exsify_news', JSON.stringify(seedNews));
  localStorage.setItem('exsify_consultations', JSON.stringify(seedConsultations));
  localStorage.setItem('exsify_downloads', JSON.stringify(seedDownloads));
  localStorage.setItem('exsify_region_stats', JSON.stringify(seedRegionStats));
}
