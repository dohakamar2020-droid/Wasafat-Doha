"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { contentSchema } from "@/lib/content-schema";
import {
  categories,
  creators,
  allNeeds,
  allTextures,
  ytThumb,
} from "@/lib/data";
import FoodImage from "@/components/FoodImage";
type Content = z.infer<typeof contentSchema>;
const split = (s: string) =>
  s
    .split(/[،,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
export default function ContentEditor({ slug }: { slug: string }) {
  const [data, setData] = useState<Content | null>(null),
    [err, setErr] = useState(""),
    [ok, setOk] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/content?slug=${encodeURIComponent(slug)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        if (!cancelled) setData(d);
      })
      .catch((e) => setErr(e.message));
    return () => {
      cancelled = true;
    };
  }, [slug]);
  const update = <K extends keyof Content>(key: K, value: Content[K]) =>
    setData((d) => (d ? { ...d, [key]: value } : d));
  const detail = (v: NonNullable<Content["detail"]>) => update("detail", v);
  const save = async () => {
    if (!data) return;
    setErr("");
    setOk("");
    const valid = contentSchema.safeParse(data);
    if (!valid.success) {
      setErr(
        `بيانات محتاجة مراجعة: ${valid.error.issues
          .map((i) => i.path.join("."))
          .slice(0, 6)
          .join("، ")}`,
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valid.data),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      update("version", d.version);
      setOk(
        data.stage === "published"
          ? "اتحفظت واتنشرت. صفحة الوصفة والبحث اتحدثوا."
          : "اتحفظت في مرحلة التحرير المختارة.",
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر الحفظ.");
    } finally {
      setBusy(false);
    }
  };
  if (!data)
    return (
      <div className="wrap">
        <p role="status">{err || "بنحمّل المحتوى…"}</p>
        <Link href="/admin">ارجع للإدارة</Link>
      </div>
    );
  const d = data.detail;
  return (
    <div className="wrap">
      <div className="page-head">
        <Link className="text-link" href="/admin">
          ارجع لقائمة التحرير
        </Link>
        <h1>تحرير ومعاينة</h1>
      </div>
      <div className="editor-grid">
        <div className="surface editor-fields">
          <label>
            عنوان الوصفة
            <input
              value={data.title}
              maxLength={200}
              onChange={(e) => update("title", e.target.value)}
            />
          </label>
          <label>
            صاحب الوصفة
            <select
              value={data.creatorId}
              onChange={(e) =>
                update("creatorId", e.target.value as Content["creatorId"])
              }
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            نوع الأكلة
            <select
              value={data.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            سبب الاختيار
            <textarea
              value={data.why}
              onChange={(e) => update("why", e.target.value)}
              placeholder="إيه الفكرة أو التقنية اللي تميزها فعلًا؟"
            />
          </label>
          <label>
            المكونات الأساسية (بفاصلة)
            <input
              defaultValue={data.mainIngredients.join("، ")}
              onBlur={(e) => update("mainIngredients", split(e.target.value))}
            />
          </label>
          <fieldset>
            <legend>القوام</legend>
            <div className="chip-row">
              {allTextures.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`ing-chip ${data.textures.includes(t) ? "on" : ""}`}
                  aria-pressed={data.textures.includes(t)}
                  onClick={() =>
                    update(
                      "textures",
                      data.textures.includes(t)
                        ? data.textures.filter((x) => x !== t)
                        : [...data.textures, t],
                    )
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>مناسبة لإيه؟</legend>
            <div className="chip-row">
              {allNeeds.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`ing-chip ${data.needs.includes(t) ? "on" : ""}`}
                  aria-pressed={data.needs.includes(t)}
                  onClick={() =>
                    update(
                      "needs",
                      data.needs.includes(t)
                        ? data.needs.filter((x) => x !== t)
                        : [...data.needs, t],
                    )
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            وقت الطبخ الكامل بالدقائق — فقط لو موثّق من المصدر
            <input
              type="number"
              min={1}
              max={10080}
              value={data.totalMinutes || ""}
              onChange={(e) =>
                update(
                  "totalMinutes",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={data.editorsPick}
              onChange={(e) => update("editorsPick", e.target.checked)}
            />{" "}
            اختيار المحرر
          </label>
          <h2>مصادر الفيديو</h2>
          {data.sources.map((s, i) => (
            <div className="surface editor-fields" key={s.ytId}>
              <a
                className="text-link"
                href={`https://www.youtube.com/watch?v=${s.ytId}`}
                target="_blank"
                rel="noreferrer"
              >
                افتح المصدر: {s.ytId}
              </a>
              <label>
                شهر النشر
                <input
                  value={s.published}
                  onChange={(e) =>
                    update(
                      "sources",
                      data.sources.map((x, n) =>
                        n === i ? { ...x, published: e.target.value } : x,
                      ),
                    )
                  }
                />
              </label>
              <label>
                المشاهدات وقت الرصد
                <input
                  type="number"
                  min={0}
                  value={s.views}
                  onChange={(e) =>
                    update(
                      "sources",
                      data.sources.map((x, n) =>
                        n === i ? { ...x, views: Number(e.target.value) } : x,
                      ),
                    )
                  }
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={s.embeddable}
                  onChange={(e) =>
                    update(
                      "sources",
                      data.sources.map((x, n) =>
                        n === i ? { ...x, embeddable: e.target.checked } : x,
                      ),
                    )
                  }
                />{" "}
                التضمين متاح
              </label>
            </div>
          ))}
          <label>
            <input
              type="checkbox"
              checked={!!d}
              onChange={(e) =>
                update(
                  "detail",
                  e.target.checked
                    ? {
                        servings: "",
                        tools: [],
                        ingredients: [
                          {
                            group: "المقادير",
                            items: [{ name: "", display: "" }],
                          },
                        ],
                        steps: [{ title: "", body: "" }],
                        successTips: [""],
                        commonMistakes: [""],
                        reviewNote: "",
                      }
                    : null,
                )
              }
            />{" "}
            المقادير والخطوات جاهزة للمراجعة
          </label>
          {d && (
            <>
              <label>
                الحصص أو مقاس الصينية
                <input
                  value={d.servings}
                  onChange={(e) => detail({ ...d, servings: e.target.value })}
                />
              </label>
              <label>
                الأدوات (بفاصلة)
                <input
                  defaultValue={d.tools.join("، ")}
                  onBlur={(e) => detail({ ...d, tools: split(e.target.value) })}
                />
              </label>
              {d.ingredients.map((g, gi) => (
                <fieldset key={gi}>
                  <legend>مجموعة مقادير {gi + 1}</legend>
                  <input
                    aria-label={`اسم مجموعة ${gi + 1}`}
                    value={g.group}
                    onChange={(e) =>
                      detail({
                        ...d,
                        ingredients: d.ingredients.map((x, n) =>
                          n === gi ? { ...x, group: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  {g.items.map((item, ii) => (
                    <div className="editor-ingredient" key={ii}>
                      {(["name", "display", "unit"] as const).map((k) => (
                        <label key={k}>
                          {k === "name"
                            ? "المكوّن"
                            : k === "display"
                              ? "الكمية كما قالها الشيف"
                              : "وحدة القياس الرقمية (اختياري)"}
                          <input
                            value={item[k] || ""}
                            onChange={(e) =>
                              detail({
                                ...d,
                                ingredients: d.ingredients.map((x, n) =>
                                  n === gi
                                    ? {
                                        ...x,
                                        items: x.items.map((it, j) =>
                                          j === ii
                                            ? {
                                                ...it,
                                                [k]:
                                                  e.target.value || undefined,
                                              }
                                            : it,
                                        ),
                                      }
                                    : x,
                                ),
                              })
                            }
                          />
                        </label>
                      ))}
                      <label>
                        كمية رقمية (اختياري)
                        <input
                          type="number"
                          step="any"
                          value={item.amount ?? ""}
                          onChange={(e) =>
                            detail({
                              ...d,
                              ingredients: d.ingredients.map((x, n) =>
                                n === gi
                                  ? {
                                      ...x,
                                      items: x.items.map((it, j) =>
                                        j === ii
                                          ? {
                                              ...it,
                                              amount: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                            }
                                          : it,
                                      ),
                                    }
                                  : x,
                              ),
                            })
                          }
                        />
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!item.optional}
                          onChange={(e) =>
                            detail({
                              ...d,
                              ingredients: d.ingredients.map((x, n) =>
                                n === gi
                                  ? {
                                      ...x,
                                      items: x.items.map((it, j) =>
                                        j === ii
                                          ? {
                                              ...it,
                                              optional: e.target.checked,
                                            }
                                          : it,
                                      ),
                                    }
                                  : x,
                              ),
                            })
                          }
                        />{" "}
                        مكوّن اختياري
                      </label>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          detail({
                            ...d,
                            ingredients: d.ingredients.map((x, n) =>
                              n === gi
                                ? {
                                    ...x,
                                    items: x.items.filter((_, j) => j !== ii),
                                  }
                                : x,
                            ),
                          })
                        }
                      >
                        احذف المكوّن
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-olive"
                    onClick={() =>
                      detail({
                        ...d,
                        ingredients: d.ingredients.map((x, n) =>
                          n === gi
                            ? {
                                ...x,
                                items: [...x.items, { name: "", display: "" }],
                              }
                            : x,
                        ),
                      })
                    }
                  >
                    أضف مكوّن
                  </button>
                </fieldset>
              ))}
              <button
                className="btn btn-ghost"
                onClick={() =>
                  detail({
                    ...d,
                    ingredients: [
                      ...d.ingredients,
                      { group: "مجموعة جديدة", items: [] },
                    ],
                  })
                }
              >
                أضف مجموعة مقادير
              </button>
              <h2>الخطوات</h2>
              {d.steps.map((st, si) => (
                <fieldset key={si}>
                  <legend>خطوة {si + 1}</legend>
                  <label>
                    العنوان
                    <input
                      value={st.title}
                      onChange={(e) =>
                        detail({
                          ...d,
                          steps: d.steps.map((x, n) =>
                            n === si ? { ...x, title: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    الشرح
                    <textarea
                      value={st.body}
                      onChange={(e) =>
                        detail({
                          ...d,
                          steps: d.steps.map((x, n) =>
                            n === si ? { ...x, body: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    علامة النتيجة
                    <input
                      value={st.cue || ""}
                      onChange={(e) =>
                        detail({
                          ...d,
                          steps: d.steps.map((x, n) =>
                            n === si ? { ...x, cue: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    مدة الخطوة الموثقة (دقائق)
                    <input
                      type="number"
                      value={st.minutes || ""}
                      onChange={(e) =>
                        detail({
                          ...d,
                          steps: d.steps.map((x, n) =>
                            n === si
                              ? {
                                  ...x,
                                  minutes: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                }
                              : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    مكونات الخطوة — اسم المجموعة:اسم المكوّن، بفاصلة
                    <input
                      defaultValue={st.ingredients?.join("، ") || ""}
                      onBlur={(e) =>
                        detail({
                          ...d,
                          steps: d.steps.map((x, n) =>
                            n === si
                              ? { ...x, ingredients: split(e.target.value) }
                              : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <button
                    className="btn btn-ghost"
                    onClick={() =>
                      detail({
                        ...d,
                        steps: d.steps.filter((_, i) => i !== si),
                      })
                    }
                  >
                    احذف الخطوة
                  </button>
                </fieldset>
              ))}
              <button
                className="btn btn-olive"
                onClick={() =>
                  detail({ ...d, steps: [...d.steps, { title: "", body: "" }] })
                }
              >
                أضف خطوة
              </button>
              <label>
                نقط النجاح — نقطة في كل سطر
                <textarea
                  value={d.successTips.join("\n")}
                  onChange={(e) =>
                    detail({ ...d, successTips: e.target.value.split("\n") })
                  }
                />
              </label>
              <label>
                الأخطاء الشائعة — نقطة في كل سطر
                <textarea
                  value={d.commonMistakes.join("\n")}
                  onChange={(e) =>
                    detail({ ...d, commonMistakes: e.target.value.split("\n") })
                  }
                />
              </label>
              <label>
                توثيق المراجعة — المصدر، التاريخ، ومن راجعه
                <textarea
                  value={d.reviewNote}
                  onChange={(e) => detail({ ...d, reviewNote: e.target.value })}
                />
              </label>
            </>
          )}
          <label>
            توثيق تجربة فعلية من الفريق (اتركه فارغًا لو مفيش)
            <textarea
              value={data.testedNote || ""}
              onChange={(e) => update("testedNote", e.target.value || null)}
              placeholder="مين طبخها، التاريخ، الملاحظة وصورة موثقة إن توفرت…"
            />
          </label>
          <label>
            مرحلة التحرير
            <select
              value={data.stage}
              onChange={(e) =>
                update("stage", e.target.value as Content["stage"])
              }
            >
              <option value="draft">وارد</option>
              <option value="review">قيد المراجعة</option>
              <option value="ready">جاهز</option>
              <option value="published">منشور للزوار</option>
              <option value="archived">مؤرشف — يختفي من المكتبة</option>
            </select>
          </label>
          {err && (
            <p className="err-box" role="alert">
              {err}
            </p>
          )}
          {ok && (
            <p className="ok-box" role="status">
              {ok}
            </p>
          )}
          <button className="btn btn-primary" onClick={save} disabled={busy}>
            {busy
              ? "جاري الحفظ…"
              : data.stage === "published"
                ? "احفظ وانشر"
                : "احفظ المرحلة"}
          </button>
        </div>
        <aside className="surface editor-preview">
          <span className="eyebrow">معاينة قبل النشر</span>
          <FoodImage
            src={ytThumb(data.sources[0]?.ytId || "")}
            alt={data.title}
            width={480}
            height={360}
          />
          <h2>{data.title}</h2>
          <p>{data.why}</p>
          <p>
            {data.category} · {d ? "مقادير وخطوات مكتملة" : "ترشيح فيديو"}
          </p>
          {d && (
            <>
              <h3>المقادير</h3>
              {d.ingredients.map((g, i) => (
                <div key={i}>
                  <b>{g.group}</b>
                  <ul>
                    {g.items.map((it, n) => (
                      <li key={n}>
                        {it.display} — {it.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <h3>الخطوات</h3>
              <ol>
                {d.steps.map((s, i) => (
                  <li key={i}>
                    <b>{s.title}</b>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </>
          )}
          <p className="notice">
            المعاينة دي مش منشورة. الزائر بيشوف آخر نسخة اتحفظت كـ«منشور».
          </p>
        </aside>
      </div>
    </div>
  );
}
