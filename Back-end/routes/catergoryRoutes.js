exports.addUserByAdmin = asyncHandler(async (req, res) => {
    const { userName, email, password, phoneNumber, role } = req.body;

    if (!userName || !email || !password || !role) {
        return res.status(400).json({ message: 'الرجاء إدخال جميع البيانات المطلوبة' });
    }

    // 🔍 التأكد إن المستخدم مش موجود مسبقًا
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'هذا المستخدم موجود بالفعل' });
    }

    // 🔒 تشفير الباسورد قبل الحفظ
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📝 إنشاء المستخدم الجديد
    const newUser = await User.create({
        userName,
        email,
        password: hashedPassword,
        phoneNumber,
        role, // الأدمين يقدر يحدد الدور (user, admin, etc.)
        isVerified: true // نفترض أن الأدمين يضيفه كمستخدم موثوق تلقائيًا
    });

    if (newUser) {
        res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح', user: newUser });
    } else {
        res.status(400).json({ message: 'حدث خطأ أثناء إنشاء المستخدم' });
    }
});
