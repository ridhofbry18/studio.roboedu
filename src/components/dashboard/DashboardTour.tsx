"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function DashboardTour({ userRole }: { userRole: string }) {
  const tourStarted = useRef(false);

  useEffect(() => {
    // Hanya untuk anggota
    if (userRole !== "anggota") return;

    const tourDone = localStorage.getItem("roboedu_tour_done");
    if (tourDone === "true") return;
    if (tourStarted.current) return;

    tourStarted.current = true;

    // Tunggu render selesai
    const timeout = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        nextBtnText: 'Lanjut ➔',
        prevBtnText: '⬅ Kembali',
        doneBtnText: 'Selesai ✔',
        progressText: '{{current}} dari {{total}}',
        steps: [
          {
            element: 'aside',
            popover: {
              title: 'Navigasi Utama',
              description: 'Di panel kiri ini, Anda bisa mengakses semua menu seperti Overview (Statistik), Schools (Sekolah), dan Events (Project).',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'a[href="/dashboard/schools"]',
            popover: {
              title: 'Menu Sekolah',
              description: 'Klik menu ini untuk melihat sekolah yang ditugaskan ke tim Anda dan menambahkan pertemuan (submission) baru.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'a[href="/dashboard/events"]',
            popover: {
              title: 'Menu Project (Events)',
              description: 'Gunakan menu ini jika Anda sedang mengerjakan project event berskala besar yang butuh persetujuan khusus.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'main',
            popover: {
              title: 'Area Utama',
              description: 'Seluruh data, status, dan riwayat pekerjaan Anda akan tampil di area ini. Mari mulai bekerja!',
              side: "top",
              align: 'center'
            }
          }
        ],
        onDestroyStarted: () => {
          if (!driverObj.hasNextStep() || confirm("Lewati sisa tutorial?")) {
            localStorage.setItem("roboedu_tour_done", "true");
            driverObj.destroy();
          }
        },
      });

      driverObj.drive();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [userRole]);

  return null;
}
