// ข้อมูลผู้ใช้และระบบ
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;
let topupCodes = JSON.parse(localStorage.getItem('topupCodes')) || {
    'CODE100': 100,
    'CODE500': 500,
    'CODE1000': 1000,
    '77฿': 77  // เพิ่มโค้ดเติมเงิน 77฿
};

// ข้อมูลแอดมิน
const ADMIN_USERNAME = 'แอดมิน';
const ADMIN_PASSWORD = 'นุ';

// ข้อมูลไอดีสำหรับสุ่ม
const randomIds1 = [
    'เกลือ',
    'เกลือ',
    'เกลือ',
    'เกลือ',
    'เกลือ'
];

const randomIds2 = [
    'ปิดปรับปรุง',
    'ปิดปรับปรุง',
    'ปิดปรับปรุง',
    'ปิดปรับปรุง',
    'ปิดปรับปรุง'
];

// ของดีพิเศษสำหรับไอดี 1฿
const specialItems = [
    '✨ LEGENDARY ACCOUNT - พิเศษสุดๆ ✨',
    '🌟 ULTRA RARE ACCOUNT - หายากมาก 🌟',
    '💎 DIAMOND ACCOUNT - มีค่ามาก 💎',
    '🔥 PREMIUM ACCOUNT - คุณภาพพรีเมียม 🔥',
    '🎯 PERFECT ACCOUNT - สมบูรณ์แบบ 🎯'
];

// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    
    // ตรวจสอบว่ามีผู้ใช้ล็อกอินอยู่หรือไม่
    if (currentUser) {
        showUserInfo();
    } else {
        showLoginForm();
    }
});

// ฟังก์ชันเริ่มต้นแอป
function initializeApp() {
    // ตรวจสอบว่ามีผู้ใช้แอดมินในระบบหรือไม่
    if (!users[ADMIN_USERNAME]) {
        users[ADMIN_USERNAME] = {
            password: ADMIN_PASSWORD,
            balance: 999999,
            isAdmin: true
        };
        saveUsers();
    }
}

// ตั้งค่าตัวจัดการเหตุการณ์
function setupEventListeners() {
    // ปุ่มเข้าสู่ระบบ
    document.getElementById('login-btn').addEventListener('click', login);
    
    // ปุ่มสมัครสมาชิก
    document.getElementById('register-btn').addEventListener('click', showRegisterModal);
    document.getElementById('submit-register').addEventListener('click', register);
    
    // ปุ่มออกจากระบบ
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // ปุ่มเติมเงิน
    document.getElementById('topup-btn').addEventListener('click', showTopupModal);
    document.getElementById('submit-topup').addEventListener('click', processTopup);
    
    // ปุ่มซื้อสินค้า
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const price = parseInt(this.getAttribute('data-price'));
            const type = this.getAttribute('data-type');
            purchaseItem(price, type);
        });
    });
    
    // ปุ่มปิด Modal
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });
    
    // ปิด Modal เมื่อคลิกนอกพื้นที่
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.add('hidden');
        }
    });
    
    // กด Enter ในช่องเติมเงิน
    document.getElementById('topup-code').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processTopup();
        }
    });
    
    // กด Enter ในช่องล็อกอิน
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
}

// ฟังก์ชันเข้าสู่ระบบ
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        return;
    }
    
    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        showUserInfo();
        
        // แสดงข้อความต้อนรับพิเศษสำหรับแอดมิน
        if (username === ADMIN_USERNAME) {
            alert('ยินดีต้อนรับแอดมิน! คุณมีสิทธิ์พิเศษในการจัดการระบบ');
        } else {
            alert('เข้าสู่ระบบสำเร็จ');
        }
        
        // ล้างฟอร์ม
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
}

// ฟังก์ชันสมัครสมาชิก
function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    
    if (!username || !password) {
        alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        return;
    }
    
    if (username.length < 3) {
        alert('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร');
        return;
    }
    
    if (password.length < 4) {
        alert('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร');
        return;
    }
    
    if (users[username]) {
        alert('ชื่อผู้ใช้นี้มีอยู่แล้ว');
        return;
    }
    
    users[username] = {
        password: password,
        balance: 0,
        isAdmin: false,
        joinDate: new Date().toLocaleDateString('th-TH')
    };
    
    saveUsers();
    document.getElementById('register-modal').classList.add('hidden');
    alert('สมัครสมาชิกสำเร็จ! คุณสามารถเข้าสู่ระบบได้เลย');
    
    // ล้างฟอร์ม
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
}

// ฟังก์ชันออกจากระบบ
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginForm();
    alert('ออกจากระบบสำเร็จ');
}

// ฟังก์ชันแสดงฟอร์มล็อกอิน
function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('result-section').classList.add('hidden');
}

// ฟังก์ชันแสดงข้อมูลผู้ใช้
function showUserInfo() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    
    document.getElementById('display-username').textContent = currentUser;
    document.getElementById('balance-amount').textContent = users[currentUser].balance;
    
    // แสดงไอคอนพิเศษสำหรับแอดมิน
    if (users[currentUser].isAdmin) {
        document.getElementById('display-username').innerHTML = currentUser + ' <span style="color:gold;">👑</span>';
    }
}

// ฟังก์ชันแสดง Modal สมัครสมาชิก
function showRegisterModal() {
    document.getElementById('register-modal').classList.remove('hidden');
}

// ฟังก์ชันแสดง Modal เติมเงิน
function showTopupModal() {
    document.getElementById('topup-modal').classList.remove('hidden');
    document.getElementById('topup-code').focus();
}

// ฟังก์ชันเติมเงิน
function processTopup() {
    const code = document.getElementById('topup-code').value;
    
    if (!code) {
        alert('กรุณากรอกรหัสเติมเงิน');
        return;
    }
    
    // ตรวจสอบรหัสเติมเงิน (case insensitive)
    const codeUpper = code.toUpperCase();
    let foundCode = null;
    let amount = 0;
    
    // ตรวจสอบทุกรหัส (case insensitive)
    for (const [key, value] of Object.entries(topupCodes)) {
        if (key.toUpperCase() === codeUpper) {
            foundCode = key;
            amount = value;
            break;
        }
    }
    
    if (foundCode) {
        users[currentUser].balance += amount;
        saveUsers();
        document.getElementById('topup-modal').classList.add('hidden');
        document.getElementById('topup-code').value = '';
        showUserInfo();
        alert(`🎉 เติมเงินสำเร็จ ${amount}฿ 🎉\nยอดเงินปัจจุบัน: ${users[currentUser].balance}฿`);
    } else {
        alert('❌ รหัสเติมเงินไม่ถูกต้อง\n\nรหัสที่ใช้ได้:\n- CODE100 (100฿)\n- CODE500 (500฿)\n- CODE1000 (1000฿)\n- 77฿ (77฿)');
    }
}

// ฟังก์ชันซื้อสินค้า
function purchaseItem(price, type) {
    if (!currentUser) {
        alert('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า');
        return;
    }
    
    if (users[currentUser].balance < price) {
        alert(`ยอดเงินไม่เพียงพอ\nต้องการ: ${price}฿\nยอดเงินปัจจุบัน: ${users[currentUser].balance}฿`);
        return;
    }
    
    // ยืนยันการซื้อ
    const itemName = type === 'id1' ? 'สุ่มไอดี 1฿' : 'สุ่มไอดีไม่มีเกลือ';
    if (!confirm(`ยืนยันการซื้อ ${itemName} ราคา ${price}฿?`)) {
        return;
    }
    
    // หักเงิน
    users[currentUser].balance -= price;
    saveUsers();
    showUserInfo();
    
    // สุ่มไอดี
    let randomId;
    let isSpecial = false;
    
    if (type === 'id1') {
        // สุ่มโอกาสได้ของดี 0.001% (1 ใน 100,000)
        const chance = Math.random() * 100000;
        
        if (chance < 1) { // 0.001% โอกาส
            randomId = specialItems[Math.floor(Math.random() * specialItems.length)];
            isSpecial = true;
            
            // บันทึกสถิติการได้ของดี
            if (!users[currentUser].specialWins) {
                users[currentUser].specialWins = 0;
            }
            users[currentUser].specialWins++;
            saveUsers();
        } else {
            randomId = randomIds1[Math.floor(Math.random() * randomIds1.length)];
        }
    } else {
        randomId = randomIds2[Math.floor(Math.random() * randomIds2.length)];
    }
    
    // แสดงผลลัพธ์
    document.getElementById('result-section').classList.remove('hidden');
    
    if (isSpecial) {
        document.getElementById('result-content').innerHTML = `
            <div class="special-result">
                <h3 style="color: gold; text-align: center;">🎉 CONGRATULATIONS! 🎉</h3>
                <p style="text-align: center; font-size: 1.2rem;">คุณได้รับของดีพิเศษ!</p>
                <p style="text-align: center; font-weight: bold; color: gold; font-size: 1.3rem;">${randomId}</p>
                <p style="text-align: center;">โอกาสได้เพียง 0.001% เท่านั้น!</p>
                <p style="text-align: center;">ราคา: ${price}฿</p>
                <p style="text-align: center;">ยอดเงินคงเหลือ: ${users[currentUser].balance}฿</p>
                ${users[currentUser].specialWins > 1 ? 
                    `<p style="text-align: center; color: lightgreen;">คุณได้ของดีแล้ว ${users[currentUser].specialWins} ครั้ง!</p>` : 
                    ''}
            </div>
        `;
        
        // เพิ่มเอฟเฟกต์เสียง (ถ้ามี)
        playSpecialSound();
    } else {
        document.getElementById('result-content').innerHTML = `
            <p>📦 คุณได้รับ: <strong>${randomId}</strong></p>
            <p>💰 ราคา: ${price}฿</p>
            <p>💳 ยอดเงินคงเหลือ: ${users[currentUser].balance}฿</p>
            ${type === 'id1' ? '<p>🎯 โอกาสได้ของดี: 50%</p>' : ''}
        `;
    }
    
    // เลื่อนไปยังผลลัพธ์
    document.getElementById('result-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// ฟังก์ชันเล่นเสียงเมื่อได้ของดี
function playSpecialSound() {
    // สร้างเสียงง่ายๆ ด้วย Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('ไม่สามารถเล่นเสียงได้');
    }
}

// ฟังก์ชันบันทึกข้อมูลผู้ใช้
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// ฟังก์ชันบันทึกรหัสเติมเงิน
function saveTopupCodes() {
    localStorage.setItem('topupCodes', JSON.stringify(topupCodes));
}

// ฟังก์ชันสำหรับแอดมิน (เพิ่มเติม)
function addTopupCode(code, amount) {
    topupCodes[code] = amount;
    saveTopupCodes();
    alert(`เพิ่มรหัสเติมเงิน ${code} มูลค่า ${amount}฿ สำเร็จ`);
}

// ฟังก์ชันสำหรับทดสอบโอกาสได้ของดี (สำหรับ developer)
function testSpecialChance() {
    let specialCount = 0;
    const totalTests = 100000;
    
    for (let i = 0; i < totalTests; i++) {
        const chance = Math.random() * 100000;
        if (chance < 1) {
            specialCount++;
        }
    }
    
    const result = `จากการทดสอบ ${totalTests.toLocaleString()} ครั้ง:
ได้ของดี: ${specialCount} ครั้ง
อัตราส่วน: ${(specialCount / totalTests * 100).toFixed(6)}%
คาดการณ์: ควรได้ประมาณ ${(totalTests / 100000).toFixed(1)} ครั้ง`;
    
    console.log(result);
    alert(result);
}

// ฟังก์ชันรีเซ็ตข้อมูล (สำหรับทดสอบ)
function resetData() {
    if (confirm('⚠️ คุณแน่ใจหรือไม่ที่จะล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
        localStorage.clear();
        location.reload();
    }
}

// ฟังก์ชันแสดงข้อมูลผู้ใช้ทั้งหมด (สำหรับแอดมิน)
function showAllUsers() {
    if (currentUser === ADMIN_USERNAME) {
        console.log('=== ข้อมูลผู้ใช้ทั้งหมด ===');
        for (const [username, data] of Object.entries(users)) {
            console.log(`ผู้ใช้: ${username}, ยอดเงิน: ${data.balance}฿, แอดมิน: ${data.isAdmin ? 'ใช่' : 'ไม่'}`);
        }
    }
}

// ทำให้ฟังก์ชันบางส่วนสามารถเรียกใช้จาก console ได้
window.testSpecialChance = testSpecialChance;
window.resetData = resetData;
window.showAllUsers = showAllUsers;
window.addTopupCode = addTopupCode;
