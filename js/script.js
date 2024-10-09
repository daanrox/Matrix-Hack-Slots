const matrixBackground = document.getElementById('matrix-background');
const generateButton = document.getElementById('generateButton');
const initialScreen = document.getElementById('initialScreen');
const generatingScreen = document.getElementById('generatingScreen');
const generatingCode = document.getElementById('generatingCode');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const depositOptions = document.getElementById('depositOptions');
const optionsContainer = document.getElementById('optionsContainer');
const accessRoxgames = document.getElementById('accessRoxgames');
const notifications = document.getElementById('notifications');
const backgroundAudio = document.getElementById('backgroundAudio');

let depositOptionsData = [
    { amount: 10, chance: 0, code: '' },
    { amount: 20, chance: 0, code: '' },
    { amount: 30, chance: 0, code: '' },
    { amount: 40, chance: 0, code: '' },
    { amount: 50, chance: 0, code: '' },
];

function createMatrixBackground() {
    const getRandomChar = () => {
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        return characters[Math.floor(Math.random() * characters.length)];
    };

    for (let i = 0; i < 50; i++) {
        const column = document.createElement('div');
        column.className = 'absolute top-0 text-green-500 text-opacity-30 whitespace-nowrap text-sm';
        column.style.left = `${i * 2}%`;
        column.style.animation = `fall ${3 + Math.random() * 5}s linear infinite`;
        column.style.animationDelay = `${Math.random() * 3}s`;

        for (let j = 0; j < 20; j++) {
            const char = document.createElement('div');
            char.textContent = getRandomChar();
            char.style.opacity = 0.7 - j * 0.05;
            column.appendChild(char);
        }

        matrixBackground.appendChild(column);
    }
}

function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '#';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result + '*10X';
}

function animateCode() {
    generatingCode.textContent = generateRandomCode();
    requestAnimationFrame(animateCode);
}

function generateOptions() {
    depositOptionsData = depositOptionsData.map((option, index) => ({
        ...option,
        chance: index === 0 ? Math.floor(Math.random() * 11) + 75 : Math.floor(Math.random() * 21) + 80,
        code: generateRandomCode()
    }));

    const randomIndex = Math.floor(Math.random() * 4) + 1;
    depositOptionsData = depositOptionsData.map((option, index) => {
        if (index === randomIndex) {
            return { ...option, chance: 100 };
        } else if (option.chance > 99) {
            return { ...option, chance: 99 };
        }
        return option;
    });

    renderDepositOptions();
}

function renderDepositOptions() {
    optionsContainer.innerHTML = '';
    depositOptionsData.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = `flex justify-between items-center bg-green-900 bg-opacity-20 rounded-lg ${option.chance === 100 ? 'border custom-border-green' : ''}`;
        optionElement.innerHTML = `
            <div>
                <p class="font-semibold text-white">DEPÓSITO R$${option.amount},00</p>
                <p class="text-sm custom-text-green">
                    Chance de virar 10x: <span class="${getChanceColor(option.chance)} ${option.chance === 100 ? 'font-semibold' : ''}">${option.chance}%</span>
                </p>
            </div>
            <button class="custom-bg-green2 hover:bg-green-600 text-black flex flex-col items-center justify-center h-auto py-2 px-4 rounded" onclick="handleCopy(${index})">
                <span class="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copiar
                </span>
                <span class="text-xs font-mono">${option.code}</span>
            </button>
        `;
        optionsContainer.appendChild(optionElement);
    });
}

function getChanceColor(chance) {
    if (chance >= 90) return 'custom-text-green';
    if (chance >= 80) return 'text-yellow-400';
    return 'text-red-400';
}

function handleCopy(index) {
    const codeToCopy = depositOptionsData[index].code;
    const button = optionsContainer.children[index].querySelector('button');
    const spanText = button.querySelector('span');

    navigator.clipboard.writeText(codeToCopy).then(() => {
        const originalText = spanText.innerHTML;
        spanText.innerHTML = 'Copiado';

        setTimeout(() => {
            spanText.innerHTML = originalText;
        }, 2000);

        showToast(`Código ${codeToCopy} copiado!`);
    }).catch(err => {
        console.error('Falha ao copiar o texto: ', err);
        showToast('Erro ao copiar o código. Por favor, tente novamente.');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'bg-green-900 bg-opacity-80 text-white p-2 mb-2 rounded-lg shadow-lg';
    toast.textContent = message;
    notifications.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function handleGenerate() {
    initialScreen.classList.add('hidden');
    generatingScreen.classList.remove('hidden');
    backgroundAudio.play().catch(error => console.error('Error playing audio:', error));

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Hackeando sistema: ${progress}%`;
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                generatingScreen.classList.add('hidden');
                depositOptions.classList.remove('hidden');
                accessRoxgames.classList.remove('hidden');
                generateOptions();
                backgroundAudio.pause();
                backgroundAudio.currentTime = 0;
            }, 500);
        }
    }, 100);

    animateCode();
}

function handleaccessRoxgames() {
    const baseUrl = 'https://china.roxgames.online/';
    window.open(baseUrl, '_blank', 'noopener,noreferrer');
}

function showNotification(name, amount) {
    const notification = document.createElement('div');
    notification.className = 'custom-bg-green bg-opacity-80 text-white p-2 mb-2 rounded-lg shadow-lg flex items-center';
    notification.style.animation = 'slideIn 0.5s ease-out, slideOut 0.5s ease-in 1.5s';
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M9 10v4m6-4v4" />
        </svg>
        ${name} depositou R$${amount},00
    `;
    notifications.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

generateButton.addEventListener('click', handleGenerate);
accessRoxgames.addEventListener('click', handleaccessRoxgames);

createMatrixBackground();
