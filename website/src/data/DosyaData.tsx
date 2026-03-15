

export interface DosyaInfo {
    heroImage: string;
    description: string;
    title: string;
    href: string;
    filterTag?: string;
}

export const DOSYA_DATA: Record<string, DosyaInfo> = {
    'cumhuriyet': {
        title: 'Cumhuriyet',
        description: 'Cumhuriyetin tarihsel sürecini, ideallerini ve günümüzdeki yansımalarını ele alıyoruz.',
        heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'cumhuriyet',
        href: '/dosyalar/cumhuriyet'
    },
    '8-mart': {
        title: '8 Mart',
        description: "8 Mart Dünya Emekçi Kadınlar Günü'ne dair yazılar ve analizler.",
        heroImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80',
        filterTag: '8 mart',
        href: '/dosyalar/8-mart'
    },
    'antiemperyalizm': {
        title: 'Antiemperyalizm',
        description: 'Emperyalizme karşı mücadele ve antiemperyalist hareketler üzerine derinlemesine analizler.',
        heroImage: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'antiemperyalizm',
        href: '/dosyalar/antiemperyalizm'
    },
    'anadil': {
        title: 'Anadil',
        description: 'Anadil hakkı, dil politikaları ve dilsel çeşitlilik üzerine yazılar.',
        heroImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'anadil',
        href: '/dosyalar/anadil'
    },
    '25-kasim': {
        title: '25 Kasım',
        description: 'Kadına yönelik şiddete karşı mücadele, İstanbul Sözleşmesi ve kadın haklarına dair yazılar.',
        heroImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'kadın mücadelesi',
        href: '/dosyalar/25-kasim'
    },
    'mesem': {
        title: 'MESEM',
        description: 'Mesleki Eğitim Merkezi sisteminde yaşanan sorunlar, güvencesiz çalışma koşulları ve genç işçiler üzerine analizler.',
        heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'MESEM',
        href: '/dosyalar/mesem'
    },
};

