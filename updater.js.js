import axios from "axios";
import { MongoClient } from "mongodb";

// --- الإعدادات النهائية ---
const RAINFOREST_URL =
  "https://api.rainforestapi.com/request?api_key=664ED90F8B0B4F02AE45B05A801D0A6D&type=search&amazon_domain=amazon.com&search_term=trend&associate_id=loomibeauty84-20&exclude_sponsored=true&sort_by=bestseller_rankings&category_id=loomibeauty84-20&language=en_US&currency=usd&page=1&max_page=5&output=json";

const MONGODB_URI =
  "mongodb+srv://loomishop:Mmm1234@cluster0.oxmvgku.mongodb.net/myShop?retryWrites=true&w=majority";

async function updateProducts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔄 1. جاري جلب منتجات الـ Trend من أمازون...");
    const response = await axios.get(RAINFOREST_URL);
    const amazonProducts = response.data.search_results;

    if (!amazonProducts || amazonProducts.length === 0) {
      console.log("⚠️ لم يتم العثور على منتجات، تأكد من مفتاح الـ API.");
      return;
    }

    console.log(`📦 تم العثور على ${amazonProducts.length} منتج.`);

    console.log("⏳ 2. جاري الاتصال بـ MongoDB Atlas...");
    await client.connect();

    // سيتم إنشاء قاعدة بيانات باسم loomi_shop ومجموعة باسم products تلقائياً
    const db = client.db("loomi_shop");
    const collection = db.collection("products");

    console.log("🚀 3. جاري نقل البيانات إلى مخزنك السحابي...");

    // إدخال المنتجات
    const result = await collection.insertMany(amazonProducts);

    console.log("-----------------------------------------");
    console.log(
      `✅ نجاح باهر! تم تخزين ${result.insertedCount} منتج في قاعدة بياناتك.`,
    );
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ خطأ في العملية:");
    console.error(error.message);
  } finally {
    await client.close();
    console.log("🔌 تم إغلاق الاتصال بأمان.");
  }
}

updateProducts();
