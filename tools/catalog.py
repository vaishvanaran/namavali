# Catalogue: which lists the app shows, under which deity group, with short names.
# id, source file (namavali-manjari path), short Devanagari name, English name, group, variant note (Tamil)

GROUPS = [
    # key, Devanagari, Tamil, English
    ("ganapati", "गणपतिः", "கணபதி", "Ganapati"),
    ("guru", "गुरवः", "குரு, ஆசார்யர்கள்", "Guru & Acharyas"),
    ("shiva", "शिवः", "சிவன்", "Shiva"),
    ("devi", "अम्बिका", "அம்பாள்", "Ambal (Devi)"),
    ("subrahmanya", "सुब्रह्मण्यः", "ஸுப்ரஹ்மண்யர்", "Subrahmanya"),
    ("vishnu", "विष्णुः", "விஷ்ணு", "Vishnu"),
    ("hanuman", "आञ्जनेयः", "ஆஞ்சநேயர்", "Hanuman"),
    ("navagraha", "नवग्रहाः", "நவக்ரஹங்கள்", "Navagraha"),
    ("dikpala", "दिक्पालाः", "திக்பாலகர்கள்", "Dikpalas"),
    ("others", "अन्ये देवताः", "ப்ரஹ்மா, வாஸ்து, நதிகள், மற்றவை", "Brahma, Vastu, rivers & others"),
]

S = "stotrasamhita"   # friend's Namavali-manjari

ITEMS = [
    # guru
    ("dakshinamurti", "100/Dakshinamurti_108.tex", "दक्षिणामूर्तिः", "Dakshinamurti", "guru", ""),
    ("vyasa", "100/Vyasa_108.tex", "वेदव्यासः", "Veda Vyasa", "guru", ""),
    ("adi-shankara", "100/AdiShankaracharya_108.tex", "श्रीशङ्करभगवत्पादाः", "Sri Shankara Bhagavatpada", "guru", ""),
    ("chandrashekharendra", "100/ChandrashekharendraSaraswati_108.tex", "श्रीचन्द्रशेखरेन्द्रसरस्वती-श्रीचरणाः", "Sri Chandrashekharendra Saraswati Sri Charanah", "guru", ""),
    # ganapati
    ("ganapati", "100/Ganapati_108.tex", "गणपतिः", "Ganapati", "ganapati", "கணேச புராணம்"),
    ("ganesha", "100/Ganesha_108.tex", "गणपतिः", "Ganapati", "ganapati", ""),
    ("gakaradi-ganapati", "100/GakaradiGanapati_108.tex", "गकारादि गणपतिः", "Gakaradi Ganapati", "ganapati", ""),
    ("gakaradi-ganapati-1000", "1000/GakaradiGanapati_1000.tex", "गकारादि गणपतिः", "Gakaradi Ganapati", "ganapati", ""),
    ("vakratunda-1000", "1000/VakratundaMahaganapati_1000.tex", "गणपतिः", "Ganapati", "ganapati", "கணேச புராணம்"),
    # subrahmanya
    ("subrahmanya", "100/Subrahmanya_108.tex", "सुब्रह्मण्यः", "Subrahmanya", "subrahmanya", ""),
    ("kartikeya", "100/Kartikeya_108.tex", "कार्त्तिकेयः", "Kartikeya", "subrahmanya", "ஸ்காந்தம்"),
    ("astrayudha", "100/SubrahmanyaHastasthitaAstrayudha_108.tex", "सुब्रह्मण्य अस्त्रायुधानि", "Subrahmanya's weapons", "subrahmanya", ""),
    ("shanmukha-1000", "1000/Shanmukha_1000.tex", "षण्मुखः", "Shanmukha", "subrahmanya", ""),
    ("valli", "100/Valli_108.tex", "वल्ली", "Valli", "subrahmanya", ""),
    ("devasena", "100/Devasena_108.tex", "देवसेना", "Devasena", "subrahmanya", ""),
    # shiva
    ("shiva", "100/Shiva_108.tex", "शिवः", "Shiva", "shiva", ""),
    ("shiva-1008", "1000/Shiva_1008.tex", "शिवः", "Shiva", "shiva", "மஹாபாரதம்"),
    ("rudra-300", "300/Rudra_300.tex", "रुद्रः", "Rudra", "shiva", "ஸ்வரத்துடன்"),
    ("mrtyunjaya", "100/Mrtyunjaya_108.tex", "मृत्युञ्जयः", "Mrityunjaya", "shiva", ""),
    ("ardhanarishvara", "100/Ardhanarishvara_108.tex", "अर्धनारीश्वरः", "Ardhanarishvara", "shiva", "216 நாமங்கள்"),
    ("harihara", "100/Harihara_108.tex", "हरिहरः", "Harihara", "shiva", ""),
    ("shiva-divyasthaniya", "100/Shiva_divyasthaniya_108.tex", "शिवः — दिव्यस्थानानि", "Shiva — sacred places", "shiva", "க்ஷேத்ர நாமங்கள்"),
    # vishnu
    ("vishnu-1000", "1000/Vishnu_1000.tex", "विष्णुः", "Vishnu", "vishnu", "மஹாபாரதம்"),
    ("vishnu-divyasthaniya", "100/Vishnu_divyasthaniya_108.tex", "विष्णुः — दिव्यस्थानानि", "Vishnu — sacred places", "vishnu", "க்ஷேத்ர நாமங்கள்"),
    ("rama", "100/Rama_108.tex", "रामः", "Rama", "vishnu", "பத்ம புராணம்"),
    ("rama-ramarahasya", "100/Rama_Ramarahasya_108.tex", "रामः", "Rama", "vishnu", "ராம ரஹஸ்யம்"),
    ("rama-1000", "1000/Rama_1000.tex", "रामः", "Rama", "vishnu", ""),
    ("krishna", "100/Krishna_108.tex", "कृष्णः", "Krishna", "vishnu", ""),
    ("lakshmi-nrisimha", "100/LakshmiNrisimha_108.tex", "लक्ष्मीनृसिंहः", "Lakshmi Nrisimha", "vishnu", "மஹாஸிம்ஹாதி"),
    ("nrisimha", "100/Nrisimha_108.tex", "लक्ष्मीनृसिंहः", "Lakshmi Nrisimha", "vishnu", "புஷ்கராக்ஷாதி"),
    ("venkatesha", "100/Venkatesha_108.tex", "वेङ्कटेशः", "Venkatesha", "vishnu", ""),
    ("venkateshwara", "100/Venkateshwara_108.tex", "वेङ्कटेशः", "Venkatesha", "vishnu", "வராஹ புராணம்"),
    ("dhanvantari", "100/Dhanvantari_108.tex", "धन्वन्तरिः", "Dhanvantari", "vishnu", ""),
    # hanuman
    ("anjaneya", "100/Anjaneya_108.tex", "हनुमान्", "Hanuman", "hanuman", ""),
    ("anjaneya-ramarahasya", "100/Anjaneya_Ramarahasya_108.tex", "हनुमान्", "Hanuman", "hanuman", "ராம ரஹஸ்யம்"),
    ("sundara-hanuman", "small/SundaraHanuman_27.tex", "सुन्दरहनुमान्", "Sundara Hanuman", "hanuman", "27 நாமங்கள்"),
    # devi
    ("lalita-300", "300/Lalita_300.tex", "ललिता", "Lalita", "devi", ""),
    ("durga", "100/Durga_108.tex", "दुर्गा", "Durga", "devi", ""),
    ("kamakshi", "100/Kamakshi_108.tex", "कामाक्षी", "Kamakshi", "devi", ""),
    ("lakshmi", "100/Lakshmi_108.tex", "लक्ष्मीः", "Lakshmi", "devi", ""),
    ("saraswati", "100/Saraswati_108.tex", "सरस्वती", "Saraswati", "devi", ""),
    ("saraswati-1008", "1000/Saraswati_1008.tex", "सरस्वती", "Saraswati", "devi", ""),
    ("annapurna", "100/Annapurna_108.tex", "अन्नपूर्णा", "Annapurna", "devi", ""),
    ("sita", "100/Sita_108.tex", "सीता", "Sita", "devi", "ஆனந்த ராமாயணம்"),
    ("sita-ramarahasya", "100/Sita_Ramarahasya_108.tex", "सीता", "Sita", "devi", "ராம ரஹஸ்யம்"),
    ("goda", "100/Goda_108.tex", "गोदा", "Goda (Andal)", "devi", ""),
    ("shakti-divyasthaniya", "100/Shakti_divyasthaniya_108.tex", "शक्तिः — दिव्यस्थानानि", "Shakti — sacred places", "devi", "க்ஷேத்ர நாமங்கள்"),
    # others
    ("surya", "100/Surya_108.tex", "सूर्यः", "Surya", "navagraha", ""),
    ("surya-mahabharata", "100/Surya_Mahabharatam_108.tex", "सूर्यः", "Surya", "navagraha", "மஹாபாரதம்"),
    ("kubera", "100/Kubera_108.tex", "कुबेरः", "Kubera", "dikpala", ""),
    ("ganga", "100/Ganga_108.tex", "गङ्गा", "Ganga", "others", "மஹாபாகவதம்"),
    ("ganga-2", "100/Ganga_108_2.tex", "गङ्गा", "Ganga", "others", ""),
    ("kaveri", "100/Kaveri_108.tex", "कावेरी", "Kaveri", "others", ""),
    ("tulasi", "100/Tulasi_108.tex", "तुलसी", "Tulasi", "others", ""),
]

# Fixes to the source text found while converting (reported to the source maintainer).
FIXES = {
    "dakshinamurti": [("श्री-धन्वन्तर्यष्टोत्तरशतनामावलिः", "श्री-दक्षिणामूर्त्यष्टोत्तरशतनामावलिः")],
}
