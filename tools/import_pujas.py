"""One-off: draft content/puja/*.txt (and content/katha/*.txt) from the friend's puja-vidhanam with tex2puja."""
import re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from tex2puja import convert, convert_katha, PV
ROOT = pathlib.Path(__file__).resolve().parent.parent
P = [  # file, id, ta, en, deity, when_ta, when_en, order
 ('varamahalakshmi-puja', 'varalakshmi-vratam', 'வரலக்ஷ்மீ வ்ரதம்', 'Varalakshmi Vratam', 'devi', 'ஶ்ராவண பௌர்ணமிக்கு முந்தைய வெள்ளிக்கிழமை', 'Friday before Śrāvaṇa pūrṇimā', 20),
 ('sarasvati-puja', 'sarasvati-puja', 'ஸரஸ்வதீ பூஜை', 'Saraswati Puja', 'devi', 'நவராத்ரி — மஹாநவமீ', 'Navarātri — Mahānavamī', 21),
 ('lakshmi-kubera-puja', 'lakshmi-kubera-puja', 'லக்ஷ்மீ குபேர பூஜை', 'Lakshmi Kubera Puja', 'devi', 'தீபாவளி / ஐப்பசி அமாவாஸ்யை', 'Dīpāvalī', 22),
 ('savitri-vratam', 'savitri-vratam', 'ஸாவித்ரீ வ்ரதம் (காரடையான் நோன்பு)', 'Savitri Vratam (Karadaiyan Nombu)', 'devi', 'மாசி-பங்குனி ஸங்க்ரமண காலம்', 'Māsi–Paṅguni saṅkramaṇa', 23),
 ('uma-maheshvara-puja', 'uma-maheshvara-puja', 'உமா மஹேஶ்வர பூஜை', 'Uma Maheshvara Puja', 'shiva', 'ப்ரதோஷம், உமா மஹேஶ்வர வ்ரதம்', 'Pradoṣa, Umā-Maheśvara vrata', 24),
 ('shivaratri-puja', 'shivaratri', 'மஹாஶிவராத்ரி — நான்கு கால பூஜை', 'Maha Shivaratri — four yama puja', 'shiva', 'மாசி க்ருஷ்ண சதுர்தஶீ இரவு', 'Māgha kṛṣṇa caturdaśī night', 25),
 ('sankataharachaturthi-vinayaka-puja', 'sankatahara-chaturthi', 'ஸங்கடஹர சதுர்த்தீ', 'Sankatahara Chaturthi', 'ganapati', 'க்ருஷ்ண பக்ஷ சதுர்த்தீ — சந்த்ரோதயம்', 'Kṛṣṇa caturthī — at moonrise', 11),
 ('skanda-shashthi-puja', 'skanda-shashthi', 'ஸ்கந்த ஷஷ்டீ', 'Skanda Shashthi', 'subrahmanya', 'ஐப்பசி ஶுக்ல ஷஷ்டீ', 'Āśvayuja/Kārttika śukla ṣaṣṭhī', 26),
 ('janmashtami-puja', 'janmashtami', 'ஸ்ரீ ஜயந்தீ (கோகுலாஷ்டமீ)', 'Sri Jayanti (Janmashtami)', 'vishnu', 'ஶ்ராவண க்ருஷ்ண அஷ்டமீ — நள்ளிரவு', 'Śrāvaṇa kṛṣṇa aṣṭamī — midnight', 27),
 ('sriramanavami-puja', 'sriramanavami', 'ஸ்ரீ ராம நவமீ', 'Sri Rama Navami', 'vishnu', 'சைத்ர ஶுக்ல நவமீ', 'Caitra śukla navamī', 28),
 ('nrisimha-jayanti-puja', 'nrisimha-jayanti', 'ந்ருஸிம்ஹ ஜயந்தீ', 'Nrisimha Jayanti', 'vishnu', 'வைஶாக ஶுக்ல சதுர்தஶீ — ஸாயங்காலம்', 'Vaiśākha śukla caturdaśī — evening', 29),
 ('dhanvantari-puja', 'dhanvantari-puja', 'தன்வந்தரி பூஜை', 'Dhanvantari Puja', 'vishnu', 'ஐப்பசி க்ருஷ்ண த்ரயோதஶீ', 'Dhanvantari trayodaśī', 30),
 ('surya-puja', 'surya-puja', 'ஸூர்ய பூஜை', 'Surya Puja', 'navagraha', 'ரத ஸப்தமீ, பொங்கல், ஞாயிறு', 'Ratha saptamī, Poṅgal, Sundays', 31),
 ('shankara-jayanti-puja', 'shankara-jayanti', 'ஶங்கர ஜயந்தீ', 'Shankara Jayanti', 'guru', 'வைஶாக ஶுக்ல பஞ்சமீ', 'Vaiśākha śukla pañcamī', 32),
 ('vyasa-puja', 'vyasa-puja', 'வ்யாஸ பூஜை', 'Vyasa Puja', 'guru', 'ஆஷாட பௌர்ணமீ', 'Āṣāḍha pūrṇimā', 33),
 ('chitragupta-puja', 'chitragupta-puja', 'சித்ரகுப்த பூஜை', 'Chitragupta Puja', 'others', 'சித்ரா பௌர்ணமீ', 'Citrā pūrṇimā', 40),
 ('go-puja', 'go-puja', 'கோ பூஜை', 'Go Puja', 'others', 'மாட்டுப் பொங்கல், கோ பூஜை நாட்கள்', 'Māṭṭu Poṅgal and other days', 41),
 ('brindavana-puja', 'tulasi-puja', 'துளஸீ (ப்ருந்தாவன) பூஜை', 'Tulasi (Brindavana) Puja', 'others', 'கார்த்திக ஶுக்ல த்வாதஶீ', 'Kārttika śukla dvādaśī', 42),
 ('kaveri-puja', 'kaveri-puja', 'காவேரீ பூஜை', 'Kaveri Puja', 'others', 'ஆடிப் பெருக்கு, துலா மாஸம்', 'Āḍi perukku, Tulā māsa', 43),
 ('ganga-puja', 'ganga-puja', 'கங்கா பூஜை', 'Ganga Puja', 'others', 'கங்கா ஸ்நானம், தீபாவளி', 'Gaṅgā snāna days', 44),
 ('laghu-panchayatana-puja', 'panchayatana-puja', 'லகு பஞ்சாயதன பூஜை', 'Laghu Panchayatana Puja', 'others', 'நித்ய பூஜை', 'Daily worship', 45),
 ('panchanga-puja', 'panchanga-puja', 'பஞ்சாங்க பூஜை (வருடப் பிறப்பு)', 'Panchanga Puja (New Year)', 'navagraha', 'சித்திரை வருடப் பிறப்பு', 'Tamil new year', 46),
 ('ekadashi-purusha-sukta-vidhana-puja', 'ekadashi-vratam', 'ஏகாதஶீ வ்ரதம் — மஹாவிஷ்ணு பூஜை', 'Ekadashi Vratam — Mahavishnu Puja', 'vishnu', 'ஏகாதஶீ (புருஷஸூக்த விதானம், ஸ்வரத்துடன்)', 'Ekādaśī (Puruṣa-sūkta vidhāna, with svara)', 34, True),
 ('yajur-upakarma', 'yajur-upakarma', 'யஜுர் உபாகர்மா (ஆவணி அவிட்டம்)', 'Yajur Upakarma (Avani Avittam)', 'others', 'ஶ்ராவண பௌர்ணமீ', 'Śrāvaṇa pūrṇimā', 50, True),
 ('surya-namaskara', 'surya-namaskara', 'ஸூர்ய நமஸ்காரம் (அருணப்ரஶ்னம்)', 'Surya Namaskara (Aruna Prashna)', 'navagraha', 'ரத ஸப்தமீ, ஞாயிறு', 'Ratha saptamī, Sundays', 51, True),
 ('sankramana-snanam', 'sankramana-snanam', 'ஸங்க்ரமண புண்யகால ஸ்நான ஸங்கல்பம்', 'Sankramana Snana Sankalpa', 'navagraha', 'மாதப் பிறப்பு', 'Month-beginning (saṅkramaṇa)', 60),
 ('surya-arghyam', 'surya-arghyam', 'ஸூர்ய அர்க்ய ப்ரதானம்', 'Surya Arghya Pradanam', 'navagraha', 'ரத ஸப்தமீ', 'Ratha saptamī', 61),
 ('kartika-somavara-arghyam', 'kartika-somavara-arghyam', 'கார்த்திக ஸோமவார அர்க்யம்', 'Kartika Somavara Arghyam', 'shiva', 'கார்த்திகை ஸோமவாரங்கள்', 'Kārttika Mondays', 62),
 ('bhishma-tarpanam', 'bhishma-tarpanam', 'பீஷ்ம தர்ப்பணம்', 'Bhishma Tarpanam', 'others', 'பீஷ்மாஷ்டமீ', 'Bhīṣmāṣṭamī', 63),
 ('yama-tarpanam', 'yama-tarpanam', 'யம தர்ப்பணம்', 'Yama Tarpanam', 'others', 'க்ருஷ்ணாங்காரக சதுர்தஶீ / நரக சதுர்தஶீ', 'Kṛṣṇāṅgāraka / Naraka caturdaśī', 64),
]
done_k = set()
for f, pid, ta, en, deity, wta, wen, order, *veda in P:
    title, txt, kathas = convert(PV / 'pujas' / f'{f}.tex', bool(veda))
    first = True
    for k in kathas:
        name = k.rsplit('/', 1)[-1]
        if name not in done_k:
            (ROOT / 'content' / 'katha' / f'{name}.txt').write_text(convert_katha(PV / f'{k}.tex'), encoding='utf-8'); done_k.add(name)
        txt = txt.replace(f'@@KATHA {k}', ('# व्रत-कथा\n\n' if first else '') + f'@include-katha {name}'); first = False
    sk = 'sukta: sri-sukta-vidhana\n' if pid in ('tulasi-puja', 'ganga-puja', 'kaveri-puja', 'go-puja') else ''
    head = f'title: {title}\nta: {ta}\nen: {en}\ndeity: {deity}\n{sk}when_ta: {wta}\nwhen_en: {wen}\norder: {order}\n\n'
    (ROOT / 'content' / 'puja' / f'{pid}.txt').write_text(head + txt, encoding='utf-8')
    print(pid, len(txt), kathas)

# sankatahara: leave out the long Mudgala-purana chapter
p = ROOT / 'content' / 'puja' / 'sankatahara-chaturthi.txt'; s = p.read_text(encoding='utf-8')
p.write_text(s.replace('\n@include-katha chaturthi-vrata-varnanam', ''), encoding='utf-8')
(ROOT / 'content' / 'katha' / 'chaturthi-vrata-varnanam.txt').unlink(missing_ok=True)

# shivaratri: name the first yāma's part
p = ROOT / 'content' / 'puja' / 'shivaratri.txt'; s = p.read_text(encoding='utf-8')
s = s.replace('\n# प्रधान-पूजा\n', '\n# साम्ब-परमेश्वर-पूजा (प्रथम-यामः)\n', 1); p.write_text(s, encoding='utf-8')
