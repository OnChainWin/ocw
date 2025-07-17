// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from './tasksschema'; // Büyük T ile import edin

const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB'ye bağlanma
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB bağlantısı başarılı!"))
  .catch((error) => console.error("MongoDB bağlantı hatası:", error));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { wallet, task, submit } = body;

    if (!wallet) {
      return NextResponse.json({ durum: false, error: "Cüzdan adresi gerekli." }, { status: 400 });
    }

    // Görev Tamamlanması
    if (task && !submit) {
      // Task.findOne (büyük T ile)
      let taskRecord = await Task.findOne({ wallet });

      if (taskRecord) {
        if (!taskRecord.tasksCompleted.includes(task)) {
          taskRecord.tasksCompleted.push(task);
          await taskRecord.save();
        }
      } else {
        taskRecord = new Task({
          wallet,
          tasksCompleted: [task],
        });
        await taskRecord.save();
      }

      return NextResponse.json({ durum: true }, { status: 200 });
    }

    // Submit İşlemi
    if (submit) {
      const taskRecord = await Task.findOne({ wallet });

      if (taskRecord) {
        taskRecord.submit = true;
        await taskRecord.save();
        return NextResponse.json({ durum: true }, { status: 200 });
      } else {
        return NextResponse.json({ durum: false, error: "Görev kaydı bulunamadı." }, { status: 404 });
      }
    }

    return NextResponse.json({ durum: false, error: "Geçersiz istek." }, { status: 400 });
  } catch (error) {
    console.error("Sunucu Hatası:", error);
    return NextResponse.json({ durum: false, error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const wallet = url.searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ durum: false, error: "Cüzdan adresi gerekli." }, { status: 400 });
    }

    const taskRecord = await Task.findOne({ wallet }).lean();

    if (taskRecord) {
      return NextResponse.json({ durum: true, tasksCompleted: taskRecord.tasksCompleted, submit: taskRecord.submit }, { status: 200 });
    } else {
      return NextResponse.json({ durum: false, error: "Görev kaydı bulunamadı." }, { status: 404 });
    }
  } catch (error) {
    console.error("Sunucu Hatası:", error);
    return NextResponse.json({ durum: false, error: "Sunucu hatası." }, { status: 500 });
  }
}