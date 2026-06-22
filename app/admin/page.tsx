"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MARQUEE_MAX_LOGOS,
  MARQUEE_RECOMMENDED_HEIGHT,
  MARQUEE_RECOMMENDED_WIDTH,
  MARQUEE_SLOT_CLASS,
  MARQUEE_SLOT_DISPLAY_HEIGHT,
} from "@/app/lib/marquee-config";
import { enrichCareersJob } from "@/app/lib/careers-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/* ─── Sidebar structure ───────────────────────────────────────────────── */
type SidebarGroup = {
  label: string;
  items: { label: string; id: string }[];
};

const sidebarGroups: SidebarGroup[] = [
  { label: "Homepage", items: [{ label: "Hero Section", id: "home-hero" }, { label: "About Section", id: "home-about" }, { label: "Blog Section", id: "home-blog" }, { label: "Our Services Section", id: "home-our-services" }, { label: "Industries Section", id: "home-industries" }, { label: "Logo Marquee", id: "home-marquee" }] },
  { label: "Industries", items: [{ label: "Industries Details", id: "industries-details" }] },
  { label: "About Page", items: [{ label: "Hero Section", id: "about-hero-content" }, { label: "Intro Section", id: "about-intro-section" }, { label: "Journey Timeline", id: "about-journey-timeline" }, { label: "Dimensions", id: "about-dimensions" }, { label: "Our Team", id: "about-team" }, { label: "Achievements", id: "about-achievements" }, { label: "Requirement Form", id: "about-requirement" }] },
  { label: "Blog Page", items: [{ label: "Page Header", id: "blog-header" }] },
  { label: "Blog Posts", items: [] },
  { label: "Contact Page", items: [{ label: "Contact Info", id: "contact" }, { label: "Form Submissions", id: "contact-submissions" }] },
  { label: "Careers Page", items: [{ label: "Hero Section", id: "careers-hero" }, { label: "Why Work at Galler", id: "careers-why-work" }, { label: "Life at Galler", id: "careers-life" }, { label: "Openings Sidebar", id: "careers-openings-sidebar" }, { label: "Hiring Process", id: "careers-hiring" }, { label: "Job Openings", id: "careers-jobs" }, { label: "General Resumes", id: "careers-resumes" }, { label: "Job Applications", id: "careers-applications" }] },
  { label: "Footer", items: [{ label: "Footer Content", id: "footer" }] },
];

/* ─── Types ───────────────────────────────────────────────────────────── */
type ContentData = Record<string, Record<string, unknown>>;

interface BlogPostData {
  id: string;
  slug: string;
  category: string;
  date: string;
  title: string;
  subtitle: string;
  heroImage?: string;
  featured?: boolean;
  content?: {
    type: string;
    text?: string;
    items?: string[];
  }[];
}

interface ContactSubmission {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  emailSent: boolean;
  createdAt: string;
}

interface ResumeSubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  resumeFileName: string;
  resumeOriginalName: string;
  resumeSize: number;
  read: boolean;
  createdAt: string;
}

interface CareersJobData {
  id: string;
  title: string;
  descriptionPoints: string[];
  location: string;
  experience: string;
  type: "Full Time" | "PPO";
  category: "engineering" | "sales" | "operations" | "manufacturing" | "support";
  department: string;
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  jobLocation: string;
  jobExperience: string;
  jobType: string;
  fullName: string;
  email: string;
  phone: string;
  resumeFileName: string;
  resumeOriginalName: string;
  resumeSize: number;
  read: boolean;
  createdAt: string;
}

const JOB_CATEGORY_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "sales", label: "Sales & Marketing" },
  { value: "operations", label: "Operations" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "support", label: "Support" },
] as const;

const JOB_TYPE_OPTIONS = ["Full Time", "PPO"] as const;

const emptyJob = (): CareersJobData => ({
  id: "",
  title: "",
  descriptionPoints: [""],
  location: "",
  experience: "",
  type: "Full Time",
  category: "engineering",
  department: "Engineering",
});

/* ─── Main component ──────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [content, setContent] = useState<ContentData>({});
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [resumeSubmissions, setResumeSubmissions] = useState<ResumeSubmission[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [careersJobs, setCareersJobs] = useState<CareersJobData[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [selectedResume, setSelectedResume] = useState<ResumeSubmission | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [editingJob, setEditingJob] = useState<CareersJobData | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingMarqueeId, setUploadingMarqueeId] = useState<string | null>(null);
  const [uploadingStatIndex, setUploadingStatIndex] = useState<number | null>(null);
  const [uploadingAboutHeroImage, setUploadingAboutHeroImage] = useState(false);
  const [uploadingContactHeroImage, setUploadingContactHeroImage] = useState(false);
  const [uploadingPlantIndex, setUploadingPlantIndex] = useState<number | null>(null);
  const [uploadingCareersHeroImage, setUploadingCareersHeroImage] = useState(false);
  const [uploadingCareersGalleryIndex, setUploadingCareersGalleryIndex] = useState<number | null>(null);
  const [uploadingIndustryIndex, setUploadingIndustryIndex] = useState<number | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("");
  const [uploadingProductImageKey, setUploadingProductImageKey] = useState<string | null>(null);
  const [uploadingProductGalleryKey, setUploadingProductGalleryKey] = useState<string | null>(null);
  const [uploadingRequirementBg, setUploadingRequirementBg] = useState(false);
  const [uploadingTeamMemberIndex, setUploadingTeamMemberIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>({
    Homepage: true,
    "About Page": false,
    "Blog Page": false,
    "Blog Posts": false,
    "Contact Page": false,
    "Careers Page": false,
    Footer: false,
    Industries: true,
  });

  const getToken = () => localStorage.getItem("galler_admin_token");

  const fetchContactSubmissions = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setContactSubmissions(await res.json());
    } catch {
      console.error("Failed to fetch contact submissions");
    }
  }, []);

  const fetchResumeSubmissions = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/careers/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setResumeSubmissions(await res.json());
    } catch {
      console.error("Failed to fetch resume submissions");
    }
  }, []);

  const fetchJobApplications = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/careers/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setJobApplications(await res.json());
    } catch {
      console.error("Failed to fetch job applications");
    }
  }, []);

  const fetchCareersJobs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/careers/jobs`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCareersJobs(data.map(enrichCareersJob));
        }
      }
    } catch {
      console.error("Failed to fetch careers jobs");
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const [contentRes, bpRes] = await Promise.all([
        fetch(`${API_URL}/api/content`),
        fetch(`${API_URL}/api/blog-posts`),
      ]);
      if (contentRes.ok) setContent(await contentRes.json());
      if (bpRes.ok) setBlogPosts(await bpRes.json());
    } catch {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetch(`${API_URL}/api/auth/verify`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error(); return fetchAll(); })
      .catch(() => { localStorage.removeItem("galler_admin_token"); router.push("/admin/login"); });
  }, [router, fetchAll]);

  useEffect(() => {
    if (activeSection === "contact-submissions") {
      fetchContactSubmissions();
    }
  }, [activeSection, fetchContactSubmissions]);

  useEffect(() => {
    if (activeSection === "careers-resumes") {
      fetchResumeSubmissions();
    }
  }, [activeSection, fetchResumeSubmissions]);

  useEffect(() => {
    if (activeSection === "careers-applications") {
      fetchJobApplications();
    }
  }, [activeSection, fetchJobApplications]);

  useEffect(() => {
    if (activeSection === "careers-jobs") {
      fetchCareersJobs();
    }
  }, [activeSection, fetchCareersJobs]);

  const markSubmissionRead = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/api/contact/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const updated = await res.json();
      setContactSubmissions((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setSelectedSubmission(updated);
    }
  };

  const markResumeRead = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/api/careers/resumes/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const updated = await res.json();
      setResumeSubmissions((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setSelectedResume(updated);
    }
  };

  const downloadResume = async (id: string, fileName: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/api/careers/resumes/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert("Failed to download resume.");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadJobApplication = async (id: string, fileName: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/api/careers/applications/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert("Failed to download resume.");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const markApplicationRead = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/api/careers/applications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const updated = await res.json();
      setJobApplications((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setSelectedApplication(updated);
    }
  };

  const saveCareersJob = async (job: CareersJobData) => {
    const token = getToken();
    if (!token) return;

    const descriptionPoints = job.descriptionPoints.map((point) => point.trim()).filter(Boolean);
    if (descriptionPoints.length === 0) {
      alert("Please add at least one description point.");
      return;
    }

    const { description: _legacyDescription, ...jobWithoutLegacyDescription } =
      job as CareersJobData & { description?: string };
    const payload = { ...jobWithoutLegacyDescription, descriptionPoints };
    const isNew = !job.id;
    const res = await fetch(
      isNew ? `${API_URL}/api/careers/jobs` : `${API_URL}/api/careers/jobs/${job.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message || "Failed to save job opening.");
      return;
    }
    await fetchCareersJobs();
    setEditingJob(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteCareersJob = async (id: string) => {
    if (!confirm("Delete this job opening?")) return;
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/api/careers/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Failed to delete job opening.");
      return;
    }
    await fetchCareersJobs();
    if (editingJob?.id === id) setEditingJob(null);
  };

  /* ── Save ── */
  const validateHomeIndustriesBeforeSave = (): string | null => {
    type GalleryItem = { src?: string };
    type Product = { name: string; gallery?: GalleryItem[] };
    type Industry = { name: string; products?: Product[] };

    const items = ((content.homeIndustries as Record<string, unknown>)?.items as Industry[]) ?? [];

    for (const industry of items) {
      for (const product of industry.products ?? []) {
        const hasEmptyAngle = (product.gallery ?? []).some((item) => !item.src?.trim());
        if (hasEmptyAngle) {
          return `Upload an image or remove empty gallery angles for "${product.name}" in ${industry.name.trim()}.`;
        }
      }
    }

    return null;
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    if (activeSection === "home-industries" || activeSection === "industries-details") {
      const validationError = validateHomeIndustriesBeforeSave();
      if (validationError) {
        alert(validationError);
        return;
      }
    }

    setSaving(true);
    try {
      if (activeSection === "home-hero") await saveContentSection("hero");
      else if (activeSection === "home-about") await saveContentSection("about");
      else if (activeSection === "home-blog") await saveContentSection("homeBlog");
      else if (activeSection === "home-our-services") await saveContentSection("homeServices");
      else if (activeSection === "home-industries") await saveContentSection("homeIndustries");
      else if (activeSection === "industries-details") await saveContentSection("homeIndustries");
      else if (activeSection === "home-marquee") await saveContentSection("marquee");
      else if (activeSection === "about-hero-content") await saveContentSection("about");
      else if (activeSection.startsWith("about-")) await saveContentSection("aboutPage");
      else if (activeSection === "contact") await saveContentSection("contactPage");
      else if (activeSection.startsWith("careers-") && !["careers-jobs", "careers-resumes", "careers-applications"].includes(activeSection)) await saveContentSection("careersPage");
      else if (activeSection === "blog-header") await saveContentSection("blogPage");
      else if (activeSection === "footer") await saveContentSection("footer");
      else if (activeSection.startsWith("blog-post-") || activeSection === "blog-posts-list") await saveBlogPosts(token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const saveContentSection = async (section: string) => {
    const token = getToken();
    await fetch(`${API_URL}/api/content/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(content[section]),
    });
  };

  const persistBlogPosts = async (posts: BlogPostData[], token?: string | null) => {
    const authToken = token ?? getToken();
    if (!authToken) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/api/blog-posts`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify(posts),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      throw new Error(data?.message || "Failed to save blog posts");
    }
  };

  const saveBlogPosts = async (token: string) => {
    await persistBlogPosts(blogPosts, token);
  };

  const handleLogout = () => {
    localStorage.removeItem("galler_admin_token");
    localStorage.removeItem("galler_admin_user");
    router.push("/admin/login");
  };

  /* ── Field helpers ── */
  const updateField = (section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateNestedField = (section: string, path: string[], value: string) => {
    setContent((prev) => {
      const sectionData = { ...(prev[section] as Record<string, unknown>) };
      let cursor: Record<string, unknown> = sectionData;
      for (let i = 0; i < path.length - 1; i++) {
        cursor[path[i]] = { ...(cursor[path[i]] as Record<string, unknown>) };
        cursor = cursor[path[i]] as Record<string, unknown>;
      }
      cursor[path[path.length - 1]] = value;
      return { ...prev, [section]: sectionData };
    });
  };

  const renderField = (section: string, field: string, label: string, multiline = false, nested?: string[]) => {
    const fieldKey = `${section}.${field}`;
    const isEditing = editingField === fieldKey;
    let value: string;
    if (nested) {
      let cursor: unknown = content[section];
      for (const k of nested) cursor = (cursor as Record<string, unknown>)?.[k];
      value = String(cursor ?? "");
    } else {
      value = String(content[section]?.[field] ?? "");
    }

    const handleChange = (v: string) => {
      if (nested) updateNestedField(section, nested, v);
      else updateField(section, field, v);
    };

    return (
      <div key={fieldKey} className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{label}</label>
          <button onClick={() => setEditingField(isEditing ? null : fieldKey)} className="text-xs font-medium text-[var(--primary-orange)] hover:underline">
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>
        {isEditing ? (
          multiline ? (
            <textarea value={value} onChange={(e) => handleChange(e.target.value)} rows={3} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" />
          ) : (
            <input type="text" value={value} onChange={(e) => handleChange(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" />
          )
        ) : (
          <p className="text-sm leading-relaxed text-[#1a1a1a]">{value}</p>
        )}
      </div>
    );
  };

  const renderImageUpload = (label: string, section: string, field: string) => {
    const currentImage = String(content[section]?.[field] ?? "");
    return (
      <div className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
        {currentImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentImage} alt={label} className="mx-auto mb-2 h-24 w-24 rounded-lg object-cover" />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="mx-auto">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
    );
  };

  const uploadImage = async (file: File): Promise<string> => {
    const token = getToken();
    if (!token) throw new Error("Not logged in. Please sign in again.");

    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = (await res.json().catch(() => null)) as { url?: string; message?: string } | null;
    if (!res.ok) {
      throw new Error(data?.message || "Upload failed");
    }
    if (!data?.url) {
      throw new Error("Upload failed — no file URL returned");
    }
    return data.url;
  };

  const uploadMarqueeLogo = uploadImage;

  const persistMarqueeLogos = async (logos: { id: string; src: string; alt: string }[]) => {
    const token = getToken();
    if (!token) throw new Error("Not logged in. Please sign in again.");

    const res = await fetch(`${API_URL}/api/content/marquee`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ logos }),
    });

    const data = (await res.json().catch(() => null)) as { message?: string } | null;
    if (!res.ok) {
      throw new Error(data?.message || "Failed to save marquee logos");
    }

    setContent((prev) => ({ ...prev, marquee: { logos } }));
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const addBlogPost = () => {
    const id = String(Date.now());
    const newPost: BlogPostData = {
      id,
      slug: `new-post-${id}`,
      category: "General",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      title: "New Blog Post",
      subtitle: "",
      heroImage: "",
      featured: false,
      content: [{ type: "paragraph", text: "" }],
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    setActiveSection(`blog-post-${id}`);
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;

    const updated = blogPosts.filter((p) => p.id !== id);
    setBlogPosts(updated);
    if (activeSection === `blog-post-${id}`) setActiveSection("blog-posts-list");

    try {
      await persistBlogPosts(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Could not save deletion. Click Save Changes to retry.");
    }
  };

  const uploadHeroVideo = async (file: File): Promise<string | null> => {
    const token = getToken();
    if (!token) return null;
    const formData = new FormData();
    formData.append("video", file);
    const res = await fetch(`${API_URL}/api/upload/video`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      alert(data?.message || "Video upload failed");
      return null;
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const deleteHeroVideo = async (url: string): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    if (url.startsWith("/uploads/")) {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        alert(data?.message || "Failed to delete video file");
        return false;
      }
    }

    updateField("hero", "videoUrl", "/videos/home-video.mp4");
    return true;
  };

  const resolvePreviewSrc = (src: string) => {
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
    return src;
  };

  /* ─── Section renderers ────────────────────────────────────────────── */

  const renderHomeHero = () => {
    const videoUrl = String(content.hero?.videoUrl ?? "/videos/home-video.mp4");

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Hero Section</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-700">Background Video</p>
            <p className="text-xs text-gray-500">
              MP4, WebM, or MOV. Max 100MB. The video loops automatically on the homepage hero.
            </p>
            <div className="overflow-hidden rounded-lg bg-black">
              <video
                key={videoUrl}
                src={resolvePreviewSrc(videoUrl)}
                controls
                muted
                playsInline
                className="aspect-video w-full max-h-48 object-cover"
              />
            </div>
            <p className="truncate text-xs text-gray-400">{videoUrl}</p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Upload video
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadHeroVideo(file);
                    if (!url) return;
                    updateField("hero", "videoUrl", url);
                    e.target.value = "";
                  }}
                />
              </label>
              {videoUrl.startsWith("/uploads/") && (
                <button
                  type="button"
                  title="Delete video"
                  aria-label="Delete video"
                  onClick={async () => {
                    if (!confirm("Delete this video and revert to the default?")) return;
                    await deleteHeroVideo(videoUrl);
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {renderField("hero", "title", "Main Headline")}
          {renderField("hero", "since", "Since Label")}
          {renderField("hero", "description", "Description", true)}
          {renderField("hero", "ctaText", "CTA Button Text")}
          {renderField("hero", "location", "Location")}
        </div>
      </div>
    );
  };

  const renderHomeAbout = () => {
    const stats = ((content.about as Record<string, unknown>)?.stats as { value: string; label: string }[]) ?? [];

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">About Section</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("about", "title", "Section Title")}
          {renderField("about", "paragraph1", "Paragraph 1", true)}
          {renderField("about", "paragraph2", "Paragraph 2", true)}
          {renderField("about", "ctaText", "CTA Button Text")}
          <hr className="border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-700">Stats</h3>
          {stats.map((stat, i) => (
            <div key={i} className="flex gap-3">
              <input
                className="w-1/3 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                value={stat.value}
                placeholder="Value"
                onChange={(e) => {
                  const newStats = [...stats];
                  newStats[i] = { ...newStats[i], value: e.target.value };
                  setContent((p) => ({ ...p, about: { ...(p.about as Record<string, unknown>), stats: newStats } }));
                }}
              />
              <input
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                value={stat.label}
                placeholder="Label"
                onChange={(e) => {
                  const newStats = [...stats];
                  newStats[i] = { ...newStats[i], label: e.target.value };
                  setContent((p) => ({ ...p, about: { ...(p.about as Record<string, unknown>), stats: newStats } }));
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHomeMarquee = () => {
    type MarqueeItem = { id: string; src: string; alt: string };
    const logos = ((content.marquee as Record<string, unknown>)?.logos as MarqueeItem[]) ?? [];

    const updateLogos = (next: MarqueeItem[]) => {
      setContent((p) => ({ ...p, marquee: { logos: next } }));
    };

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Logo Marquee</h2>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Recommended logo size for a uniform look</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-amber-800">
            <li>
              <strong>{MARQUEE_RECOMMENDED_WIDTH} × {MARQUEE_RECOMMENDED_HEIGHT} px</strong> square or landscape (PNG or SVG, transparent background)
            </li>
            <li>
              On-site display height: <strong>{MARQUEE_SLOT_DISPLAY_HEIGHT} px</strong> — crop tight around the logo, avoid extra whitespace in the file
            </li>
            <li>
              Maximum <strong>{MARQUEE_MAX_LOGOS} logos</strong> in{" "}
              <strong>2 rows of {MARQUEE_MAX_LOGOS / 2}</strong> — uploads save automatically
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-500">
          {logos.length} / {MARQUEE_MAX_LOGOS} logos · Uploads and removals save instantly.
        </p>
        <div className="flex flex-col gap-4">
          {logos.map((logo, i) => (
            <div key={logo.id} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div className={`relative mx-auto flex shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 sm:mx-0 ${MARQUEE_SLOT_CLASS}`}>
                {logo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolvePreviewSrc(logo.src)} alt={logo.alt} className="h-full w-full object-contain p-2 sm:p-2.5" />
                ) : (
                  <span className="text-xs text-gray-400">No logo</span>
                )}
              </div>
              <div className="flex flex-1 flex-wrap gap-2">
                <label
                  className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingMarqueeId === logo.id ? "pointer-events-none opacity-50" : ""}`}
                >
                  {uploadingMarqueeId === logo.id ? "Uploading…" : logo.src ? "Replace logo" : "Upload logo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    className="hidden"
                    disabled={uploadingMarqueeId === logo.id}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingMarqueeId(logo.id);
                      try {
                        const url = await uploadMarqueeLogo(file);
                        const altFromFile = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Client logo";
                        const next = [...logos];
                        next[i] = { ...next[i], src: url, alt: altFromFile };
                        updateLogos(next);
                        await persistMarqueeLogos(next);
                        setSaved(true);
                        setTimeout(() => setSaved(false), 2000);
                      } catch (err) {
                        alert(err instanceof Error ? err.message : "Upload failed");
                      } finally {
                        setUploadingMarqueeId(null);
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={uploadingMarqueeId === logo.id}
                  onClick={async () => {
                    const next = logos.filter((_, idx) => idx !== i);
                    updateLogos(next);
                    try {
                      await persistMarqueeLogos(next);
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Failed to remove logo");
                    }
                  }}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={logos.length >= MARQUEE_MAX_LOGOS}
          onClick={() => {
            if (logos.length >= MARQUEE_MAX_LOGOS) {
              alert(`Maximum ${MARQUEE_MAX_LOGOS} logos allowed.`);
              return;
            }
            updateLogos([...logos, { id: String(Date.now()), src: "", alt: "Client logo" }]);
          }}
          className="w-fit rounded-lg bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add logo
        </button>
      </div>
    );
  };

  const renderHomeBlog = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Blog Section</h2>
      <p className="text-sm text-gray-500">Controls the heading and labels shown in the homepage blog preview.</p>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {renderField("homeBlog", "tagline", "Tagline")}
        {renderField("homeBlog", "heading", "Heading")}
        {renderField("homeBlog", "headingHighlight", "Highlighted Word")}
        {renderField("homeBlog", "ctaText", "View All Blogs Button Text")}
        {renderField("homeBlog", "readMoreText", "Read More Button Text")}
      </div>
    </div>
  );

  const renderHomeOurServices = () => {
    type Category = { id: string; number: number; title: string; icon: string; items: string[] };
    const categories = ((content.homeServices as Record<string, unknown>)?.categories as Category[]) ?? [];

    const updateCategories = (next: Category[]) => {
      setContent((p) => ({ ...p, homeServices: { ...(p.homeServices as Record<string, unknown>), categories: next } }));
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Our Services Section</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("homeServices", "tagline", "Tagline")}
          {renderField("homeServices", "title", "Title")}
          {renderField("homeServices", "subtitle", "Subtitle", true)}
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
          <button
            type="button"
            onClick={() => updateCategories([...categories, { id: String(Date.now()), number: categories.length + 1, title: "New Category", icon: "design", items: ["New item"] }])}
            className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
          >
            + Add Category
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {categories.map((cat, i) => (
            <div key={cat.id} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#1a1a1a]">{cat.title || `Category ${i + 1}`}</h4>
                <button
                  type="button"
                  onClick={() => updateCategories(categories.filter((_, idx) => idx !== i))}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex flex-1 flex-col gap-1 min-w-[140px]">
                  <label className="text-xs font-medium text-gray-500">Title</label>
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => { const n = [...categories]; n[i] = { ...n[i], title: e.target.value }; updateCategories(n); }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                  />
                </div>
                <div className="flex w-20 flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Number</label>
                  <input
                    type="number"
                    value={cat.number}
                    onChange={(e) => { const n = [...categories]; n[i] = { ...n[i], number: Number(e.target.value) }; updateCategories(n); }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                  />
                </div>
                <div className="flex w-36 flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Icon</label>
                  <select
                    value={cat.icon}
                    onChange={(e) => { const n = [...categories]; n[i] = { ...n[i], icon: e.target.value }; updateCategories(n); }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                  >
                    <option value="design">Design</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="lifecycle">Lifecycle</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-500">Items</label>
                {cat.items.map((item, ii) => (
                  <div key={ii} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => { const n = [...categories]; const ni = [...cat.items]; ni[ii] = e.target.value; n[i] = { ...n[i], items: ni }; updateCategories(n); }}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                    />
                    <button
                      type="button"
                      onClick={() => { const n = [...categories]; n[i] = { ...n[i], items: cat.items.filter((_, idx) => idx !== ii) }; updateCategories(n); }}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => { const n = [...categories]; n[i] = { ...n[i], items: [...cat.items, "New item"] }; updateCategories(n); }}
                  className="mt-1 text-left text-xs font-medium text-[var(--primary-orange)] hover:underline"
                >
                  + Add item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHomeIndustries = () => {
    type IndustryItem = {
      id: string;
      slug?: string;
      name: string;
      image: string;
      products?: unknown[];
    };

    const section = (content.homeIndustries as Record<string, unknown>) ?? {};
    const items = (section.items as IndustryItem[]) ?? [];

    const updateSection = (patch: Record<string, unknown>) => {
      setContent((p) => ({
        ...p,
        homeIndustries: { ...(p.homeIndustries as Record<string, unknown>), ...patch },
      }));
    };

    const updateItems = (next: IndustryItem[]) => updateSection({ items: next });

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Industries Section</h2>
        <p className="text-sm text-gray-500">Manage homepage industry cards and their images.</p>

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("homeIndustries", "title", "Section Title")}
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Industry Cards</h3>
          <button
            type="button"
            onClick={() =>
              updateItems([
                ...items,
                {
                  id: String(Date.now()),
                  name: "NEW INDUSTRY",
                  image: "",
                  products: [],
                },
              ])
            }
            className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
          >
            + Add Industry
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item, i) => {
            const updateItem = (patch: Partial<IndustryItem>) => {
              const next = [...items];
              next[i] = { ...next[i], ...patch };
              updateItems(next);
            };

            return (
              <div key={item.id} className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="aspect-[3/4] w-full shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:w-40">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolvePreviewSrc(item.image)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-[#1a1a1a]">{item.name || `Industry ${i + 1}`}</h4>
                      <button
                        type="button"
                        onClick={() => updateItems(items.filter((_, idx) => idx !== i))}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500">Industry Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem({ name: e.target.value })}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label
                        className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingIndustryIndex === i ? "pointer-events-none opacity-50" : ""}`}
                      >
                        {uploadingIndustryIndex === i ? "Uploading…" : item.image ? "Replace card image" : "Upload card image"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          className="hidden"
                          disabled={uploadingIndustryIndex === i}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingIndustryIndex(i);
                            try {
                              const url = await uploadImage(file);
                              updateItem({ image: url });
                            } catch (err) {
                              alert(err instanceof Error ? err.message : "Upload failed");
                            } finally {
                              setUploadingIndustryIndex(null);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                      {item.image ? (
                        <button
                          type="button"
                          disabled={uploadingIndustryIndex === i}
                          onClick={() => updateItem({ image: "" })}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Remove card image
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderIndustriesDetails = () => {
    type GalleryItem = { id: string; src: string; alt?: string; type?: "image" | "video"; videoUrl?: string };
    type IndustryProduct = {
      id: string;
      slug?: string;
      name: string;
      image?: string;
      description?: string;
      keyFeatures?: string[];
      gallery?: GalleryItem[];
    };
    type IndustryItem = {
      id: string;
      slug?: string;
      name: string;
      image: string;
      products?: IndustryProduct[];
    };

    const section = (content.homeIndustries as Record<string, unknown>) ?? {};
    const items = (section.items as IndustryItem[]) ?? [];
    const activeIndustryId = selectedIndustryId || items[0]?.id || "";
    const industryIndex = items.findIndex((item) => item.id === activeIndustryId);
    const industry = industryIndex >= 0 ? items[industryIndex] : undefined;
    const products = industry?.products ?? [];

    const updateSection = (patch: Record<string, unknown>) => {
      setContent((p) => ({
        ...p,
        homeIndustries: { ...(p.homeIndustries as Record<string, unknown>), ...patch },
      }));
    };

    const updateItems = (next: IndustryItem[]) => updateSection({ items: next });

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    const slugify = (text: string, id: string) => {
      const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return slug || id;
    };

    const updateProducts = (next: IndustryProduct[]) => {
      if (industryIndex < 0) return;
      const nextItems = [...items];
      nextItems[industryIndex] = { ...nextItems[industryIndex], products: next };
      updateItems(nextItems);
    };

    if (!items.length) {
      return (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Industries Details</h2>
          <p className="text-sm text-gray-500">Add industries in Homepage → Industries Section first.</p>
        </div>
      );
    }

    const industrySlug = industry ? industry.slug?.trim() || slugify(industry.name, industry.id) : "";

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Industries Details</h2>
        <p className="text-sm text-gray-500">
          Select an industry and manage its products (e.g. DC Energy Meter) with descriptions, features, and gallery images.
        </p>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <label className="text-xs font-semibold text-gray-700">Select Industry</label>
          <select
            value={activeIndustryId}
            onChange={(e) => setSelectedIndustryId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)] sm:max-w-md"
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {industry ? (
            <p className="mt-2 text-xs text-gray-500">
              Products appear at /industries/{industrySlug}/[product-slug]
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Products in {industry?.name ?? "Industry"}
          </h3>
          <button
            type="button"
            onClick={() =>
              updateProducts([
                ...products,
                {
                  id: String(Date.now()),
                  slug: "",
                  name: "NEW PRODUCT",
                  image: "",
                  description: "",
                  keyFeatures: [""],
                  gallery: [],
                },
              ])
            }
            className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
          >
            + Add Product
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {products.map((product, pi) => {
            const gallery = product.gallery ?? [];
            const keyFeatures = product.keyFeatures ?? [];
            const productSlug = product.slug?.trim() || slugify(product.name, product.id);
            const imageUploadKey = `${industryIndex}-${pi}-main`;

            const updateProduct = (patch: Partial<IndustryProduct>) => {
              const next = [...products];
              next[pi] = { ...next[pi], ...patch };
              updateProducts(next);
            };

            const updateGallery = (next: GalleryItem[]) => updateProduct({ gallery: next });
            const updateKeyFeatures = (next: string[]) => updateProduct({ keyFeatures: next });

            return (
              <div key={product.id} className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">{product.name || `Product ${pi + 1}`}</h4>
                    <p className="mt-1 text-xs text-gray-500">
                      /industries/{industrySlug}/{productSlug}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateProducts(products.filter((_, idx) => idx !== pi))}
                    className="text-xs font-medium text-red-500 hover:underline"
                  >
                    Remove product
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolvePreviewSrc(product.image)}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">Product Name</label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct({ name: e.target.value })}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">URL Slug</label>
                        <input
                          type="text"
                          value={product.slug ?? ""}
                          placeholder={slugify(product.name, product.id)}
                          onChange={(e) => updateProduct({ slug: e.target.value })}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label
                        className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingProductImageKey === imageUploadKey ? "pointer-events-none opacity-50" : ""}`}
                      >
                        {uploadingProductImageKey === imageUploadKey ? "Uploading…" : product.image ? "Replace main image" : "Upload main image"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          className="hidden"
                          disabled={uploadingProductImageKey === imageUploadKey}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingProductImageKey(imageUploadKey);
                            try {
                              const url = await uploadImage(file);
                              updateProduct({ image: url });
                            } catch (err) {
                              alert(err instanceof Error ? err.message : "Upload failed");
                            } finally {
                              setUploadingProductImageKey(null);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                  <label className="text-xs font-semibold text-gray-700">Basic Description</label>
                  <textarea
                    value={product.description ?? ""}
                    onChange={(e) => updateProduct({ description: e.target.value })}
                    rows={4}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700">Key Features</label>
                    <button
                      type="button"
                      onClick={() => updateKeyFeatures([...keyFeatures, "New feature"])}
                      className="text-xs font-medium text-[var(--primary-orange)] hover:underline"
                    >
                      + Add feature
                    </button>
                  </div>
                  {keyFeatures.map((feature, fi) => (
                    <div key={fi} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const next = [...keyFeatures];
                          next[fi] = e.target.value;
                          updateKeyFeatures(next);
                        }}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
                      />
                      <button
                        type="button"
                        onClick={() => updateKeyFeatures(keyFeatures.filter((_, idx) => idx !== fi))}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Gallery Images (angles)</label>
                      <p className="mt-1 text-xs text-gray-500">Shown below the main image on the product page.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateGallery([
                          ...gallery,
                          { id: String(Date.now()), src: "", type: "image" },
                        ])
                      }
                      className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
                    >
                      + Add angle
                    </button>
                  </div>

                  {gallery.map((image, gi) => {
                    const uploadKey = `${industryIndex}-${pi}-${gi}`;
                    return (
                      <div key={image.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row">
                        <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:w-32">
                          {image.src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={resolvePreviewSrc(image.src)}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <label
                              className={`cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingProductGalleryKey === uploadKey ? "pointer-events-none opacity-50" : ""}`}
                            >
                              {uploadingProductGalleryKey === uploadKey ? "Uploading…" : image.src ? "Replace image" : "Upload image"}
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/jpg"
                                className="hidden"
                                disabled={uploadingProductGalleryKey === uploadKey}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setUploadingProductGalleryKey(uploadKey);
                                  try {
                                    const url = await uploadImage(file);
                                    const next = [...gallery];
                                    next[gi] = { ...next[gi], src: url };
                                    updateGallery(next);
                                  } catch (err) {
                                    alert(err instanceof Error ? err.message : "Upload failed");
                                  } finally {
                                    setUploadingProductGalleryKey(null);
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => updateGallery(gallery.filter((_, idx) => idx !== gi))}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                          {!image.src ? (
                            <p className="text-xs text-amber-600">Upload an image or remove this angle before saving.</p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {products.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              No products yet. Click &quot;+ Add Product&quot; to create one (e.g. DC Energy Meter).
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  const renderAboutHeroContent = () => {
    const backgroundImage = String((content.about as Record<string, unknown>)?.backgroundImage ?? "");

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">About Page — Hero Section</h2>
        <p className="text-sm text-gray-500">Controls the hero banner background, title, and description text shown at the top of the about page.</p>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-700">Hero Background Image</p>
            <p className="text-xs text-gray-500">
              PNG, JPG, or WebP. Recommended wide landscape image. Uploads save automatically.
            </p>
            {backgroundImage ? (
              <div className="overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvePreviewSrc(backgroundImage)}
                  alt="About hero preview"
                  className="aspect-[21/9] w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[21/9] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                No background image uploaded
              </div>
            )}
            <p className="truncate text-xs text-gray-400">{backgroundImage || "No image set — homepage video will show as fallback"}</p>
            <div className="flex flex-wrap items-center gap-2">
              <label
                className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingAboutHeroImage ? "pointer-events-none opacity-50" : ""}`}
              >
                {uploadingAboutHeroImage ? "Uploading…" : backgroundImage ? "Replace image" : "Upload image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  disabled={uploadingAboutHeroImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingAboutHeroImage(true);
                    try {
                      const url = await uploadImage(file);
                      updateField("about", "backgroundImage", url);
                      await saveContentSection("about");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setUploadingAboutHeroImage(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
              {backgroundImage && (
                <button
                  type="button"
                  disabled={uploadingAboutHeroImage}
                  onClick={async () => {
                    updateField("about", "backgroundImage", "");
                    try {
                      await saveContentSection("about");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Failed to remove image");
                    }
                  }}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
          {renderField("about", "title", "Hero Title", false)}
          {renderField("about", "paragraph1", "Hero Description — Part 1", true)}
          {renderField("about", "paragraph2", "Hero Description — Part 2", true)}
        </div>
      </div>
    );
  };

  const renderAboutIntroSection = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">About Page — Intro Section</h2>
      <p className="text-sm text-gray-500">
        Controls the gray section below the hero with the heading, body text, and G logo.
      </p>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {renderField("aboutPage", "introSection.title", "Section Heading", false, ["introSection", "title"])}
        {renderField("aboutPage", "introSection.paragraph1", "Paragraph 1", true, ["introSection", "paragraph1"])}
        {renderField("aboutPage", "introSection.paragraph2", "Paragraph 2", true, ["introSection", "paragraph2"])}
      </div>
    </div>
  );

  const renderAboutJourneyTimeline = () => {
    type Milestone = { year: string; description: string };
    const milestones = ((content.aboutPage as Record<string, unknown>)?.journeyTimeline as Record<string, unknown>)?.milestones as Milestone[] ?? [];
    
    const updateMilestones = (next: Milestone[]) => {
      setContent((p) => ({ 
        ...p, 
        aboutPage: { 
          ...(p.aboutPage as Record<string, unknown>), 
          journeyTimeline: { 
            ...((p.aboutPage as Record<string, unknown>)?.journeyTimeline as Record<string, unknown>), 
            milestones: next 
          } 
        } 
      }));
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">About Page — Journey Timeline</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("aboutPage", "journeyTimeline.heading", "Section Heading", false, ["journeyTimeline", "heading"])}
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Timeline Milestones</h3>
            <button
              onClick={() => {
                updateMilestones([...milestones, { year: "20XX", description: "New milestone description" }]);
              }}
              className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
            >+ Add Milestone</button>
          </div>
          {milestones.map((milestone, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Year" 
                  value={milestone.year} 
                  onChange={(e) => {
                    const next = [...milestones];
                    next[i] = { ...next[i], year: e.target.value };
                    updateMilestones(next);
                  }} 
                  className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
                />
                <button 
                  onClick={() => updateMilestones(milestones.filter((_, idx) => idx !== i))} 
                  className="ml-auto rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >Remove</button>
              </div>
              <textarea 
                placeholder="Description" 
                value={milestone.description} 
                onChange={(e) => {
                  const next = [...milestones];
                  next[i] = { ...next[i], description: e.target.value };
                  updateMilestones(next);
                }} 
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAboutDimensions = () => {
    type Card = { title: string; description: string; icon: string };
    const cards = ((content.aboutPage as Record<string, unknown>)?.dimensions as Record<string, unknown>)?.cards as Card[] ?? [];
    
    const updateCards = (next: Card[]) => {
      setContent((p) => ({ 
        ...p, 
        aboutPage: { 
          ...(p.aboutPage as Record<string, unknown>), 
          dimensions: { 
            ...((p.aboutPage as Record<string, unknown>)?.dimensions as Record<string, unknown>), 
            cards: next 
          } 
        } 
      }));
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">About Page — Dimensions</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("aboutPage", "dimensions.heading", "Section Heading", false, ["dimensions", "heading"])}
          {renderField("aboutPage", "dimensions.subtitle", "Subtitle", false, ["dimensions", "subtitle"])}
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Dimension Cards</h3>
            <button
              onClick={() => {
                updateCards([...cards, { title: "NEW DIMENSION", description: "Description here", icon: "box" }]);
              }}
              className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
            >+ Add Card</button>
          </div>
          {cards.map((card, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Title" 
                  value={card.title} 
                  onChange={(e) => {
                    const next = [...cards];
                    next[i] = { ...next[i], title: e.target.value };
                    updateCards(next);
                  }} 
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
                />
                <button 
                  onClick={() => updateCards(cards.filter((_, idx) => idx !== i))} 
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >Remove</button>
              </div>
              <textarea 
                placeholder="Description" 
                value={card.description} 
                onChange={(e) => {
                  const next = [...cards];
                  next[i] = { ...next[i], description: e.target.value };
                  updateCards(next);
                }} 
                rows={4}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
              />
              <input 
                type="text" 
                placeholder="Icon (e.g., box, forklift, truck)" 
                value={card.icon} 
                onChange={(e) => {
                  const next = [...cards];
                  next[i] = { ...next[i], icon: e.target.value };
                  updateCards(next);
                }} 
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAboutTeam = () => {
    type Member = {
      id: string;
      name: string;
      photo: string;
      linkedin: string;
      instagram: string;
      description: string;
    };
    const members = ((content.aboutPage as Record<string, unknown>)?.team as Record<string, unknown>)?.members as Member[] ?? [];

    const updateMembers = (next: Member[]) => {
      setContent((p) => ({
        ...p,
        aboutPage: {
          ...(p.aboutPage as Record<string, unknown>),
          team: {
            ...((p.aboutPage as Record<string, unknown>)?.team as Record<string, unknown>),
            members: next,
          },
        },
      }));
    };

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">About Page — Our Team</h2>
        <p className="text-sm text-gray-500">
          Add team members with a photo, name, social links, and description. Three members appear per row on the about page.
        </p>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("aboutPage", "team.heading", "Section Heading", false, ["team", "heading"])}
          {renderField("aboutPage", "team.subtitle", "Section Subtitle", false, ["team", "subtitle"])}
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Team Members</h3>
            <button
              onClick={() => {
                updateMembers([
                  ...members,
                  {
                    id: String(Date.now()),
                    name: "Team Member",
                    photo: "",
                    linkedin: "",
                    instagram: "",
                    description: "",
                  },
                ]);
              }}
              className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
            >
              + Add Member
            </button>
          </div>
          {members.map((member, i) => (
            <div key={member.id} className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-white sm:mx-0">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolvePreviewSrc(member.photo)}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No photo</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => {
                        const next = [...members];
                        next[i] = { ...next[i], name: e.target.value };
                        updateMembers(next);
                      }}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                    />
                    <button
                      onClick={() => updateMembers(members.filter((_, idx) => idx !== i))}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label
                      className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 ${uploadingTeamMemberIndex === i ? "pointer-events-none opacity-50" : ""}`}
                    >
                      {uploadingTeamMemberIndex === i ? "Uploading…" : member.photo ? "Replace photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        className="hidden"
                        disabled={uploadingTeamMemberIndex === i}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingTeamMemberIndex(i);
                          try {
                            const url = await uploadImage(file);
                            const next = [...members];
                            next[i] = { ...next[i], photo: url };
                            updateMembers(next);
                            await saveContentSection("aboutPage");
                            setSaved(true);
                            setTimeout(() => setSaved(false), 2000);
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Upload failed");
                          } finally {
                            setUploadingTeamMemberIndex(null);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                    {member.photo && (
                      <button
                        type="button"
                        disabled={uploadingTeamMemberIndex === i}
                        onClick={async () => {
                          const next = [...members];
                          next[i] = { ...next[i], photo: "" };
                          updateMembers(next);
                          try {
                            await saveContentSection("aboutPage");
                            setSaved(true);
                            setTimeout(() => setSaved(false), 2000);
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Failed to remove photo");
                          }
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={member.linkedin}
                    onChange={(e) => {
                      const next = [...members];
                      next[i] = { ...next[i], linkedin: e.target.value };
                      updateMembers(next);
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                  />
                  <input
                    type="text"
                    placeholder="Instagram URL"
                    value={member.instagram}
                    onChange={(e) => {
                      const next = [...members];
                      next[i] = { ...next[i], instagram: e.target.value };
                      updateMembers(next);
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                  />
                  <textarea
                    placeholder="Description"
                    value={member.description}
                    onChange={(e) => {
                      const next = [...members];
                      next[i] = { ...next[i], description: e.target.value };
                      updateMembers(next);
                    }}
                    rows={4}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAboutAchievements = () => {
    type Stat = { value: string; label: string; tone: string; backgroundImage?: string };
    const stats = ((content.aboutPage as Record<string, unknown>)?.achievements as Record<string, unknown>)?.stats as Stat[] ?? [];
    
    const updateStats = (next: Stat[]) => {
      setContent((p) => ({ 
        ...p, 
        aboutPage: { 
          ...(p.aboutPage as Record<string, unknown>), 
          achievements: { 
            ...((p.aboutPage as Record<string, unknown>)?.achievements as Record<string, unknown>), 
            stats: next 
          } 
        } 
      }));
    };

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">About Page — Achievements</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("aboutPage", "achievements.heading", "Section Heading", false, ["achievements", "heading"])}
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Achievement Stats</h3>
            <button
              onClick={() => {
                updateStats([...stats, { value: "100+", label: "New Stat", tone: "team", backgroundImage: "" }]);
              }}
              className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
            >+ Add Stat</button>
          </div>
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Value (e.g., 450+)" 
                  value={stat.value} 
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], value: e.target.value };
                    updateStats(next);
                  }} 
                  className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
                />
                <input 
                  type="text" 
                  placeholder="Label" 
                  value={stat.label} 
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], label: e.target.value };
                    updateStats(next);
                  }} 
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
                />
                <button 
                  onClick={() => updateStats(stats.filter((_, idx) => idx !== i))} 
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >Remove</button>
              </div>
              <input 
                type="text" 
                placeholder="Tone (team, devices, clients, industries)" 
                value={stat.tone} 
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...next[i], tone: e.target.value };
                  updateStats(next);
                }} 
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]" 
              />
              
              {/* Background Image Upload */}
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3">
                {stat.backgroundImage && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={resolvePreviewSrc(stat.backgroundImage)} 
                      alt="Preview" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-wrap gap-2">
                  <label
                    className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 ${uploadingStatIndex === i ? "pointer-events-none opacity-50" : ""}`}
                  >
                    {uploadingStatIndex === i ? "Uploading…" : stat.backgroundImage ? "Replace Image" : "Upload Background"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      className="hidden"
                      disabled={uploadingStatIndex === i}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingStatIndex(i);
                        try {
                          const url = await uploadImage(file);
                          const next = [...stats];
                          next[i] = { ...next[i], backgroundImage: url };
                          updateStats(next);
                          await saveContentSection("aboutPage");
                          setSaved(true);
                          setTimeout(() => setSaved(false), 2000);
                        } catch (err) {
                          alert(err instanceof Error ? err.message : "Upload failed");
                        } finally {
                          setUploadingStatIndex(null);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                  {stat.backgroundImage && (
                    <button
                      type="button"
                      disabled={uploadingStatIndex === i}
                      onClick={async () => {
                        const next = [...stats];
                        next[i] = { ...next[i], backgroundImage: "" };
                        updateStats(next);
                        try {
                          await saveContentSection("aboutPage");
                          setSaved(true);
                          setTimeout(() => setSaved(false), 2000);
                        } catch (err) {
                          alert(err instanceof Error ? err.message : "Failed to remove image");
                        }
                      }}
                      className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAboutRequirement = () => {
    const requirement = ((content.aboutPage as Record<string, unknown>)?.requirement as Record<string, unknown>) ?? {};
    const backgroundImage = String(requirement.backgroundImage ?? "");

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    const updateRequirement = (field: string, value: string) => {
      setContent((p) => ({
        ...p,
        aboutPage: {
          ...(p.aboutPage as Record<string, unknown>),
          requirement: {
            ...((p.aboutPage as Record<string, unknown>)?.requirement as Record<string, unknown>),
            [field]: value,
          },
        },
      }));
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">About Page — Requirement Form</h2>
        <p className="text-sm text-gray-500">Controls the heading, background image, and submit button for the requirement form on the about page.</p>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-700">Section Background Image</p>
            <p className="text-xs text-gray-500">
              PNG, JPG, or WebP. Recommended wide landscape image. Uploads save automatically.
            </p>
            {backgroundImage ? (
              <div className="overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvePreviewSrc(backgroundImage)}
                  alt="Requirement section preview"
                  className="aspect-[21/9] w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[21/9] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                No background image uploaded
              </div>
            )}
            <p className="truncate text-xs text-gray-400">{backgroundImage || "No image set — gradient fallback will show"}</p>
            <div className="flex flex-wrap items-center gap-2">
              <label
                className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingRequirementBg ? "pointer-events-none opacity-50" : ""}`}
              >
                {uploadingRequirementBg ? "Uploading…" : backgroundImage ? "Replace image" : "Upload image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  disabled={uploadingRequirementBg}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingRequirementBg(true);
                    try {
                      const url = await uploadImage(file);
                      updateRequirement("backgroundImage", url);
                      await saveContentSection("aboutPage");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setUploadingRequirementBg(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
              {backgroundImage && (
                <button
                  type="button"
                  disabled={uploadingRequirementBg}
                  onClick={async () => {
                    updateRequirement("backgroundImage", "");
                    try {
                      await saveContentSection("aboutPage");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Failed to remove image");
                    }
                  }}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
          {renderField("aboutPage", "requirement.heading", "Form Heading", false, ["requirement", "heading"])}
          {renderField("aboutPage", "requirement.submitText", "Submit Button Text", false, ["requirement", "submitText"])}
        </div>
      </div>
    );
  };

  const renderBlogHeader = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Blog Page — Header</h2>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {renderField("blogPage", "heading", "Page Heading")}
        {renderField("blogPage", "tagline", "Tagline")}
      </div>
    </div>
  );

  const renderBlogPostsList = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Blog Posts</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add posts with a cover photo and title. The 3 newest appear on the homepage. Deletions save automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={addBlogPost}
          className="rounded-xl bg-[var(--primary-orange)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b8451a]"
        >
          + Add Post
        </button>
      </div>

      {blogPosts.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
          No blog posts yet. Click &quot;Add Post&quot; to create one.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {post.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolvePreviewSrc(post.heroImage)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    No cover
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#1a1a1a]">{post.title}</p>
                <p className="text-xs text-gray-400">
                  {post.category} · {post.date}
                  {index < 3 ? " · Shows on homepage" : ""}
                  {post.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSection(`blog-post-${post.id}`)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-[var(--primary-orange)] hover:text-[var(--primary-orange)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteBlogPost(post.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBlogPost = (sectionId: string) => {
    const postId = sectionId.replace("blog-post-", "");
    const idx = blogPosts.findIndex((p) => p.id === postId);
    const post = blogPosts[idx];
    if (!post) return <p className="text-gray-400">Blog post not found.</p>;

    const updatePost = (updates: Partial<BlogPostData>) => {
      setBlogPosts((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], ...updates };
        return next;
      });
    };

    const updateParagraph = (pi: number, text: string) => {
      let paragraphIndex = 0;
      const contentBlocks = (post.content || [{ type: "paragraph", text: "" }]).map((block) => {
        if (block.type !== "paragraph") return block;
        if (paragraphIndex === pi) {
          paragraphIndex++;
          return { type: "paragraph", text };
        }
        paragraphIndex++;
        return block;
      });
      updatePost({ content: contentBlocks });
    };

    const paragraphs = (post.content || []).filter((b) => b.type === "paragraph");

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Edit Blog Post</h2>
          <button
            type="button"
            onClick={() => setActiveSection("blog-posts-list")}
            className="text-sm text-gray-500 hover:text-[var(--primary-orange)]"
          >
            ← Back to all posts
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-700">Cover Photo</p>
            <p className="text-xs text-gray-500">Shown on the homepage cards and /blog listing.</p>
            {post.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvePreviewSrc(post.heroImage)}
                alt="Cover preview"
                className="mx-auto h-40 w-full max-w-md rounded-lg object-cover"
              />
            ) : null}
            <label className="mx-auto cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {post.heroImage ? "Change cover photo" : "Upload cover photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadImage(file);
                    updatePost({ heroImage: url });
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Upload failed");
                  } finally {
                    e.target.value = "";
                  }
                }}
              />
            </label>
            {post.heroImage ? (
              <button
                type="button"
                onClick={() => updatePost({ heroImage: "" })}
                className="mx-auto text-xs text-red-500 hover:underline"
              >
                Remove cover photo
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => {
                const title = e.target.value;
                const updates: Partial<BlogPostData> = { title };
                if (post.slug.startsWith("new-post-") || post.slug === slugify(post.title)) {
                  updates.slug = slugify(title) || post.slug;
                }
                updatePost(updates);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Slug (URL)</label>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => updatePost({ slug: slugify(e.target.value) })}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Category</label>
              <input
                type="text"
                value={post.category}
                onChange={(e) => updatePost({ category: e.target.value })}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Date</label>
              <input
                type="text"
                value={post.date}
                onChange={(e) => updatePost({ date: e.target.value })}
                placeholder="Jan 6, 2026"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
              />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <input
                id={`featured-${post.id}`}
                type="checkbox"
                checked={!!post.featured}
                onChange={(e) => updatePost({ featured: e.target.checked })}
                className="h-4 w-4 accent-[var(--primary-orange)]"
              />
              <label htmlFor={`featured-${post.id}`} className="text-sm text-gray-700">
                Featured post (special layout on /blog)
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Subtitle / Excerpt</label>
            <textarea
              value={post.subtitle}
              onChange={(e) => updatePost({ subtitle: e.target.value })}
              rows={3}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-700">Article Content</h3>
            {(paragraphs.length ? paragraphs : [{ type: "paragraph", text: "" }]).map((block, pi) => (
              <div key={pi} className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Paragraph {pi + 1}
                </label>
                <textarea
                  value={block.text || ""}
                  onChange={(e) => updateParagraph(pi, e.target.value)}
                  rows={4}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updatePost({
                  content: [...(post.content || []), { type: "paragraph", text: "" }],
                })
              }
              className="self-start rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-[var(--primary-orange)] hover:text-[var(--primary-orange)]"
            >
              + Add paragraph
            </button>
          </div>

          <button
            type="button"
            onClick={() => deleteBlogPost(post.id)}
            className="self-start rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
          >
            Delete this post
          </button>
        </div>
      </div>
    );
  };

  const renderContact = () => {
    type Plant = { name: string; address: string; image?: string };
    const plants =
      ((content.contactPage as Record<string, unknown>)?.plants as Plant[]) ?? [];

    const updatePlants = (next: Plant[]) => {
      setContent((p) => ({
        ...p,
        contactPage: {
          ...(p.contactPage as Record<string, unknown>),
          plants: next,
        },
      }));
    };

    const resolvePreviewSrc = (src: string) => {
      if (src.startsWith("http://") || src.startsWith("https://")) return src;
      if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
      return src;
    };

    const backgroundImage = content.contactPage?.backgroundImage || "";

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Contact Page</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-700">Hero Background Image</p>
            <p className="text-xs text-gray-500">
              PNG, JPG, or WebP. Recommended wide landscape image. Uploads save automatically.
            </p>
            {backgroundImage ? (
              <div className="overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvePreviewSrc(backgroundImage)}
                  alt="Contact hero preview"
                  className="aspect-[21/9] w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[21/9] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                No background image uploaded
              </div>
            )}
            <p className="truncate text-xs text-gray-400">
              {backgroundImage || "No image set — navy background will show as fallback"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label
                className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingContactHeroImage ? "pointer-events-none opacity-50" : ""}`}
              >
                {uploadingContactHeroImage ? "Uploading…" : backgroundImage ? "Replace image" : "Upload image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  disabled={uploadingContactHeroImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingContactHeroImage(true);
                    try {
                      const url = await uploadImage(file);
                      updateField("contactPage", "backgroundImage", url);
                      await saveContentSection("contactPage");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setUploadingContactHeroImage(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
              {backgroundImage && (
                <button
                  type="button"
                  disabled={uploadingContactHeroImage}
                  onClick={async () => {
                    updateField("contactPage", "backgroundImage", "");
                    try {
                      await saveContentSection("contactPage");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Failed to remove image");
                    }
                  }}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
          {renderField("contactPage", "heading", "Heading")}
          {renderField("contactPage", "description", "Description", true)}
          {renderField("contactPage", "phone1", "Phone 1")}
          {renderField("contactPage", "phone2", "Phone 2")}
          {renderField("contactPage", "email", "Email")}
          {renderField("contactPage", "address1", "Corporate Office Address", true)}
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Our Plants</h3>
              <p className="mt-1 text-xs text-gray-500">
                Shown in the &quot;Our Plants&quot; section on the contact page.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updatePlants([
                  ...plants,
                  { name: "PLANT 5 – NEW LOCATION", address: "Enter plant address", image: "" },
                ])
              }
              className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
            >
              + Add Plant
            </button>
          </div>
          {plants.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">
              No plants added yet.
            </p>
          ) : (
            plants.map((plant, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Plant name"
                    value={plant.name}
                    onChange={(e) => {
                      const next = [...plants];
                      next[i] = { ...next[i], name: e.target.value };
                      updatePlants(next);
                    }}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                  />
                  <button
                    type="button"
                    onClick={() => updatePlants(plants.filter((_, idx) => idx !== i))}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  placeholder="Plant address"
                  value={plant.address}
                  rows={2}
                  onChange={(e) => {
                    const next = [...plants];
                    next[i] = { ...next[i], address: e.target.value };
                    updatePlants(next);
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[var(--primary-orange)]"
                />
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3">
                  {plant.image ? (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolvePreviewSrc(plant.image)}
                        alt="Plant preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-wrap gap-2">
                    <label
                      className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 ${uploadingPlantIndex === i ? "pointer-events-none opacity-50" : ""}`}
                    >
                      {uploadingPlantIndex === i
                        ? "Uploading…"
                        : plant.image
                          ? "Replace Image"
                          : "Upload Image"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        className="hidden"
                        disabled={uploadingPlantIndex === i}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingPlantIndex(i);
                          try {
                            const url = await uploadImage(file);
                            const next = [...plants];
                            next[i] = { ...next[i], image: url };
                            updatePlants(next);
                            await saveContentSection("contactPage");
                            setSaved(true);
                            setTimeout(() => setSaved(false), 2000);
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Upload failed");
                          } finally {
                            setUploadingPlantIndex(null);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                    {plant.image ? (
                      <button
                        type="button"
                        disabled={uploadingPlantIndex === i}
                        onClick={async () => {
                          const next = [...plants];
                          next[i] = { ...next[i], image: "" };
                          updatePlants(next);
                          try {
                            await saveContentSection("contactPage");
                            setSaved(true);
                            setTimeout(() => setSaved(false), 2000);
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Failed to remove image");
                          }
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Remove Image
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderContactSubmissions = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Form Submissions</h2>
        <button
          type="button"
          onClick={fetchContactSubmissions}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-[var(--primary-orange)] hover:text-[var(--primary-orange)]"
        >
          Refresh
        </button>
      </div>

      {contactSubmissions.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
          No submissions yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
            {contactSubmissions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedSubmission(item);
                  if (!item.read) markSubmissionRead(item.id);
                }}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  selectedSubmission?.id === item.id
                    ? "border-[var(--primary-orange)] bg-orange-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${item.read ? "text-gray-700" : "text-[#1a1a1a]"}`}>
                      {item.fullName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{item.subject}</p>
                  </div>
                  {!item.read ? (
                    <span className="rounded-full bg-[var(--primary-orange)] px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {selectedSubmission ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">From</p>
                  <p className="mt-1 text-lg font-semibold text-[#1a1a1a]">{selectedSubmission.fullName}</p>
                  {selectedSubmission.companyName ? (
                    <p className="text-sm text-gray-500">{selectedSubmission.companyName}</p>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Email</p>
                    <a href={`mailto:${selectedSubmission.email}`} className="mt-1 block text-sm text-[var(--primary-orange)]">
                      {selectedSubmission.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Phone</p>
                    <p className="mt-1 text-sm text-gray-700">{selectedSubmission.phone || "—"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Subject</p>
                  <p className="mt-1 text-sm text-gray-700">{selectedSubmission.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {selectedSubmission.message}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {selectedSubmission.emailSent ? "Email notification sent" : "Saved without email notification"} ·{" "}
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="py-12 text-center text-gray-400">Select a submission to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderCareersHero = () => {
    const hero = (content.careersPage as Record<string, unknown> | undefined)?.hero as Record<string, unknown> | undefined;
    const heroImage = String(hero?.image ?? "");

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Careers Page — Hero Section</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-700">Hero Image</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WebP. Shown on the right side of the hero on desktop.</p>
            {heroImage ? (
              <div className="overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolvePreviewSrc(heroImage)} alt="Careers hero preview" className="aspect-[5/4] w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[5/4] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                No hero image uploaded
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <label
                className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingCareersHeroImage ? "pointer-events-none opacity-50" : ""}`}
              >
                {uploadingCareersHeroImage ? "Uploading…" : heroImage ? "Replace image" : "Upload image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  disabled={uploadingCareersHeroImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingCareersHeroImage(true);
                    try {
                      const url = await uploadImage(file);
                      updateNestedField("careersPage", ["hero", "image"], url);
                      await saveContentSection("careersPage");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setUploadingCareersHeroImage(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
              {heroImage ? (
                <button
                  type="button"
                  disabled={uploadingCareersHeroImage}
                  onClick={async () => {
                    updateNestedField("careersPage", ["hero", "image"], "");
                    try {
                      await saveContentSection("careersPage");
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Failed to remove image");
                    }
                  }}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove image
                </button>
              ) : null}
            </div>
          </div>
          {renderField("careersPage", "hero.headingLine1", "Heading Line 1", false, ["hero", "headingLine1"])}
          {renderField("careersPage", "hero.headingLine2", "Heading Line 2", false, ["hero", "headingLine2"])}
          {renderField("careersPage", "hero.headingLine3", "Heading Line 3", false, ["hero", "headingLine3"])}
          {renderField("careersPage", "hero.description", "Description", true, ["hero", "description"])}
          {renderField("careersPage", "hero.viewPositionsText", "View Positions Button", false, ["hero", "viewPositionsText"])}
          {renderField("careersPage", "hero.submitResumeText", "Submit Resume Button", false, ["hero", "submitResumeText"])}
        </div>
      </div>
    );
  };

  const renderCareersWhyWork = () => {
    type Benefit = { title: string; description: string; icon?: string };
    const benefits =
      (((content.careersPage as Record<string, unknown>)?.whyWork as Record<string, unknown>)?.benefits as Benefit[]) ??
      [];

    const updateBenefits = (next: Benefit[]) => {
      setContent((p) => ({
        ...p,
        careersPage: {
          ...(p.careersPage as Record<string, unknown>),
          whyWork: {
            ...((p.careersPage as Record<string, unknown>)?.whyWork as Record<string, unknown>),
            benefits: next,
          },
        },
      }));
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Careers Page — Why Work at Galler</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("careersPage", "whyWork.heading", "Section Heading", false, ["whyWork", "heading"])}
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Benefits</h3>
            <button
              type="button"
              onClick={() =>
                updateBenefits([...benefits, { title: "NEW BENEFIT", description: "", icon: "meaningful" }])
              }
              className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
            >
              + Add Benefit
            </button>
          </div>
          {benefits.map((benefit, i) => (
            <div key={`${benefit.title}-${i}`} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={benefit.title}
                  onChange={(e) => {
                    const next = [...benefits];
                    next[i] = { ...next[i], title: e.target.value };
                    updateBenefits(next);
                  }}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
                />
                <button
                  type="button"
                  onClick={() => updateBenefits(benefits.filter((_, idx) => idx !== i))}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Description"
                value={benefit.description}
                onChange={(e) => {
                  const next = [...benefits];
                  next[i] = { ...next[i], description: e.target.value };
                  updateBenefits(next);
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCareersLife = () => {
    type GalleryImage = { id: string; src: string; label: string };
    const images =
      (((content.careersPage as Record<string, unknown>)?.lifeAtGaller as Record<string, unknown>)?.images as GalleryImage[]) ??
      [];

    const updateImages = (next: GalleryImage[]) => {
      setContent((p) => ({
        ...p,
        careersPage: {
          ...(p.careersPage as Record<string, unknown>),
          lifeAtGaller: {
            ...((p.careersPage as Record<string, unknown>)?.lifeAtGaller as Record<string, unknown>),
            images: next,
          },
        },
      }));
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Careers Page — Life at Galler</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          {renderField("careersPage", "lifeAtGaller.heading", "Section Heading", false, ["lifeAtGaller", "heading"])}
          {renderField("careersPage", "lifeAtGaller.subtitle", "Subtitle", false, ["lifeAtGaller", "subtitle"])}
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Gallery Images</h3>
              <p className="mt-1 text-xs text-gray-500">
                Add as many photos as you need — 6, 20, or more. Use + Add Image for each new slot.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateImages([...images, { id: String(Date.now()), src: "", label: "New Image" }])
              }
              className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
            >
              + Add Image
            </button>
          </div>
          {images.map((image, i) => (
            <div key={image.id} className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row">
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:w-48">
                {image.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolvePreviewSrc(image.src)} alt={image.label} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={image.label}
                    onChange={(e) => {
                      const next = [...images];
                      next[i] = { ...next[i], label: e.target.value };
                      updateImages(next);
                    }}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
                  />
                  <button
                    type="button"
                    onClick={() => updateImages(images.filter((_, idx) => idx !== i))}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label
                    className={`cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${uploadingCareersGalleryIndex === i ? "pointer-events-none opacity-50" : ""}`}
                  >
                    {uploadingCareersGalleryIndex === i ? "Uploading…" : image.src ? "Replace image" : "Upload image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      className="hidden"
                      disabled={uploadingCareersGalleryIndex === i}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCareersGalleryIndex(i);
                        try {
                          const url = await uploadImage(file);
                          const next = [...images];
                          next[i] = { ...next[i], src: url };
                          updateImages(next);
                          await saveContentSection("careersPage");
                          setSaved(true);
                          setTimeout(() => setSaved(false), 2000);
                        } catch (err) {
                          alert(err instanceof Error ? err.message : "Upload failed");
                        } finally {
                          setUploadingCareersGalleryIndex(null);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                  {image.src ? (
                    <button
                      type="button"
                      disabled={uploadingCareersGalleryIndex === i}
                      onClick={async () => {
                        const next = [...images];
                        next[i] = { ...next[i], src: "" };
                        updateImages(next);
                        await saveContentSection("careersPage");
                      }}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove image
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCareersOpeningsSidebar = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Careers Page — Openings Sidebar</h2>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {renderField("careersPage", "openingsSidebar.ctaHeading", "CTA Heading", false, ["openingsSidebar", "ctaHeading"])}
        {renderField("careersPage", "openingsSidebar.ctaParagraph1", "CTA Paragraph 1", true, ["openingsSidebar", "ctaParagraph1"])}
        {renderField("careersPage", "openingsSidebar.ctaParagraph2", "CTA Paragraph 2", true, ["openingsSidebar", "ctaParagraph2"])}
        {renderField("careersPage", "openingsSidebar.ctaButtonText", "CTA Button Text", false, ["openingsSidebar", "ctaButtonText"])}
        <hr className="border-gray-100" />
        {renderField("careersPage", "openingsSidebar.networkHeading", "Talent Network Heading", false, ["openingsSidebar", "networkHeading"])}
        {renderField("careersPage", "openingsSidebar.networkDescription", "Talent Network Description", true, ["openingsSidebar", "networkDescription"])}
      </div>
    </div>
  );

  const renderCareersHiring = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Careers Page — Hiring Process</h2>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {renderField("careersPage", "hiringProcess.heading", "Section Heading", false, ["hiringProcess", "heading"])}
        <hr className="border-gray-100" />
        <h3 className="text-sm font-semibold text-gray-700">Contact Banner</h3>
        {renderField("careersPage", "hiringProcess.contactBanner.heading", "Banner Heading", false, ["hiringProcess", "contactBanner", "heading"])}
        {renderField("careersPage", "hiringProcess.contactBanner.description", "Banner Description", false, ["hiringProcess", "contactBanner", "description"])}
        {renderField("careersPage", "hiringProcess.contactBanner.email", "Email", false, ["hiringProcess", "contactBanner", "email"])}
        {renderField("careersPage", "hiringProcess.contactBanner.phone", "Phone", false, ["hiringProcess", "contactBanner", "phone"])}
        {renderField("careersPage", "hiringProcess.contactBanner.buttonText", "Button Text", false, ["hiringProcess", "contactBanner", "buttonText"])}
      </div>
    </div>
  );

  const renderCareersJobs = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Job Openings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage current openings shown on the careers page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditingJob(emptyJob())}
          className="rounded-xl bg-[var(--primary-orange)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b8451a]"
        >
          + Add Opening
        </button>
      </div>

      {editingJob ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">
            {editingJob.id ? "Edit Job Opening" : "New Job Opening"}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Category</label>
              <select
                value={editingJob.category}
                onChange={(e) =>
                  setEditingJob((prev) =>
                    prev
                      ? {
                          ...prev,
                          category: e.target.value as CareersJobData["category"],
                          department:
                            JOB_CATEGORY_OPTIONS.find((item) => item.value === e.target.value)?.label ||
                            e.target.value,
                        }
                      : prev
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
              >
                {JOB_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Job Type</label>
              <select
                value={editingJob.type}
                onChange={(e) =>
                  setEditingJob((prev) =>
                    prev ? { ...prev, type: e.target.value as CareersJobData["type"] } : prev
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
              >
                {JOB_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Job Title</label>
              <input
                type="text"
                value={editingJob.title}
                onChange={(e) => setEditingJob((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Location</label>
              <input
                type="text"
                value={editingJob.location}
                onChange={(e) => setEditingJob((prev) => (prev ? { ...prev, location: e.target.value } : prev))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Experience</label>
              <input
                type="text"
                value={editingJob.experience}
                onChange={(e) => setEditingJob((prev) => (prev ? { ...prev, experience: e.target.value } : prev))}
                placeholder="e.g. 2-5 Years"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Description Points
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setEditingJob((prev) =>
                      prev ? { ...prev, descriptionPoints: [...prev.descriptionPoints, ""] } : prev
                    )
                  }
                  className="rounded-lg bg-[var(--primary-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8451a]"
                >
                  + Add Point
                </button>
              </div>
              <p className="text-xs text-gray-500">
                The first two points appear on the careers page. Remaining points show when candidates click
                &quot;View Details&quot;.
              </p>
              <div className="flex flex-col gap-3">
                {editingJob.descriptionPoints.map((point, index) => (
                  <div key={`job-point-${index}`} className="flex gap-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) =>
                        setEditingJob((prev) => {
                          if (!prev) return prev;
                          const nextPoints = [...prev.descriptionPoints];
                          nextPoints[index] = e.target.value;
                          return { ...prev, descriptionPoints: nextPoints };
                        })
                      }
                      placeholder={`Point ${index + 1}`}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary-orange)]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingJob((prev) => {
                          if (!prev) return prev;
                          const nextPoints = prev.descriptionPoints.filter((_, i) => i !== index);
                          return {
                            ...prev,
                            descriptionPoints: nextPoints.length > 0 ? nextPoints : [""],
                          };
                        })
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => saveCareersJob(editingJob)}
              className="rounded-lg bg-[#0b1f4a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1840]"
            >
              Save Opening
            </button>
            <button
              type="button"
              onClick={() => setEditingJob(null)}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {careersJobs.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
          No job openings yet. Click &quot;Add Opening&quot; to create one.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {careersJobs.map((job) => (
            <div key={job.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-[#1a1a1a]">{job.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {job.department} · {job.location} · {job.experience} · {job.type}
                  </p>
                  {job.descriptionPoints.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
                      {job.descriptionPoints.slice(0, 2).map((point, index) => (
                        <li key={`${job.id}-preview-${index}`}>{point}</li>
                      ))}
                      {job.descriptionPoints.length > 2 ? (
                        <li className="list-none pl-0 text-gray-400">
                          +{job.descriptionPoints.length - 2} more point
                          {job.descriptionPoints.length - 2 === 1 ? "" : "s"}
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingJob(enrichCareersJob(job))}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCareersJob(job.id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderJobApplications = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Job Applications</h2>
        <button
          type="button"
          onClick={fetchJobApplications}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-[var(--primary-orange)] hover:text-[var(--primary-orange)]"
        >
          Refresh
        </button>
      </div>

      {jobApplications.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
          No job applications yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
            {jobApplications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedApplication(item);
                  if (!item.read) markApplicationRead(item.id);
                }}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  selectedApplication?.id === item.id
                    ? "border-[var(--primary-orange)] bg-orange-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${item.read ? "text-gray-700" : "text-[#1a1a1a]"}`}>
                      {item.fullName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{item.jobTitle}</p>
                  </div>
                  {!item.read ? (
                    <span className="rounded-full bg-[var(--primary-orange)] px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {selectedApplication ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Applied For</p>
                  <p className="mt-1 text-lg font-semibold text-[#1a1a1a]">{selectedApplication.jobTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{selectedApplication.jobDescription}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {selectedApplication.jobLocation} · {selectedApplication.jobExperience} · {selectedApplication.jobType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Candidate</p>
                  <p className="mt-1 text-base font-semibold text-[#1a1a1a]">{selectedApplication.fullName}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Email</p>
                    <a href={`mailto:${selectedApplication.email}`} className="mt-1 block text-sm text-[var(--primary-orange)]">
                      {selectedApplication.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Phone</p>
                    <p className="mt-1 text-sm text-gray-700">{selectedApplication.phone || "—"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Resume</p>
                  <p className="mt-1 text-sm text-gray-700">{selectedApplication.resumeOriginalName}</p>
                  <button
                    type="button"
                    onClick={() =>
                      downloadJobApplication(selectedApplication.id, selectedApplication.resumeOriginalName)
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#0b1f4a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a1840]"
                  >
                    Download Resume
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(selectedApplication.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="py-12 text-center text-gray-400">Select an application to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderResumeSubmissions = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">General Resume Submissions</h2>
        <button
          type="button"
          onClick={fetchResumeSubmissions}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-[var(--primary-orange)] hover:text-[var(--primary-orange)]"
        >
          Refresh
        </button>
      </div>

      {resumeSubmissions.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
          No resume submissions yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
            {resumeSubmissions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedResume(item);
                  if (!item.read) markResumeRead(item.id);
                }}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  selectedResume?.id === item.id
                    ? "border-[var(--primary-orange)] bg-orange-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${item.read ? "text-gray-700" : "text-[#1a1a1a]"}`}>
                      {item.fullName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{item.email}</p>
                  </div>
                  {!item.read ? (
                    <span className="rounded-full bg-[var(--primary-orange)] px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 truncate text-xs text-gray-400">{item.resumeOriginalName}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {selectedResume ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Candidate</p>
                  <p className="mt-1 text-lg font-semibold text-[#1a1a1a]">{selectedResume.fullName}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Email</p>
                    <a href={`mailto:${selectedResume.email}`} className="mt-1 block text-sm text-[var(--primary-orange)]">
                      {selectedResume.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Phone</p>
                    <p className="mt-1 text-sm text-gray-700">{selectedResume.phone || "—"}</p>
                  </div>
                </div>
                {selectedResume.message ? (
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {selectedResume.message}
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Resume</p>
                  <p className="mt-1 text-sm text-gray-700">{selectedResume.resumeOriginalName}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {(selectedResume.resumeSize / 1024).toFixed(1)} KB
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      downloadResume(selectedResume.id, selectedResume.resumeOriginalName)
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#0b1f4a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a1840]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Download Resume
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(selectedResume.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="py-12 text-center text-gray-400">Select a submission to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderFooter = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Footer</h2>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">Newsletter</h3>
        {renderField("footer", "newsletter.heading", "Heading", false, ["newsletter", "heading"])}
        {renderField("footer", "newsletter.description", "Description", true, ["newsletter", "description"])}
        <hr className="border-gray-100" />
        <h3 className="text-sm font-semibold text-gray-700">Contact Info</h3>
        {renderField("footer", "contact.address", "Address", true, ["contact", "address"])}
        {renderField("footer", "contact.phone", "Phone", false, ["contact", "phone"])}
        {renderField("footer", "contact.email", "Email", false, ["contact", "email"])}
        <hr className="border-gray-100" />
        <h3 className="text-sm font-semibold text-gray-700">Social Media</h3>
        {renderField("footer", "social.facebook", "Facebook URL", false, ["social", "facebook"])}
        {renderField("footer", "social.instagram", "Instagram URL", false, ["social", "instagram"])}
        {renderField("footer", "social.whatsapp", "WhatsApp URL", false, ["social", "whatsapp"])}
        {renderField("footer", "social.twitter", "Twitter URL", false, ["social", "twitter"])}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Pages Managed", value: "7", color: "bg-blue-50 text-blue-600" },
          { label: "Industries", value: String(((content.homeIndustries as Record<string, unknown>)?.items as unknown[])?.length ?? 0), color: "bg-green-50 text-green-600" },
          { label: "Blog Posts", value: String(blogPosts.length), color: "bg-purple-50 text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-2 inline-block rounded-lg px-3 py-1 text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Quick Navigation</h3>
        <div className="flex flex-wrap gap-3">
          {sidebarGroups.flatMap((g) => g.items.slice(0, 2)).map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-[var(--primary-orange)] hover:text-[var(--primary-orange)]">
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--primary-orange)]" />
      </div>
    );
    if (activeSection === "dashboard") return renderDashboard();
    if (activeSection === "home-hero") return renderHomeHero();
    if (activeSection === "home-about") return renderHomeAbout();
    if (activeSection === "home-blog") return renderHomeBlog();
    if (activeSection === "home-our-services") return renderHomeOurServices();
    if (activeSection === "home-industries") return renderHomeIndustries();
    if (activeSection === "industries-details") return renderIndustriesDetails();
    if (activeSection === "home-marquee") return renderHomeMarquee();
    if (activeSection === "about-hero-content") return renderAboutHeroContent();
    if (activeSection === "about-intro-section") return renderAboutIntroSection();
    if (activeSection === "about-journey-timeline") return renderAboutJourneyTimeline();
    if (activeSection === "about-dimensions") return renderAboutDimensions();
    if (activeSection === "about-team") return renderAboutTeam();
    if (activeSection === "about-achievements") return renderAboutAchievements();
    if (activeSection === "about-requirement") return renderAboutRequirement();
    if (activeSection === "blog-header") return renderBlogHeader();
    if (activeSection === "blog-posts-list") return renderBlogPostsList();
    if (activeSection.startsWith("blog-post-")) return renderBlogPost(activeSection);
    if (activeSection === "contact") return renderContact();
    if (activeSection === "contact-submissions") return renderContactSubmissions();
    if (activeSection === "careers-hero") return renderCareersHero();
    if (activeSection === "careers-why-work") return renderCareersWhyWork();
    if (activeSection === "careers-life") return renderCareersLife();
    if (activeSection === "careers-openings-sidebar") return renderCareersOpeningsSidebar();
    if (activeSection === "careers-hiring") return renderCareersHiring();
    if (activeSection === "careers-jobs") return renderCareersJobs();
    if (activeSection === "careers-resumes") return renderResumeSubmissions();
    if (activeSection === "careers-applications") return renderJobApplications();
    if (activeSection === "footer") return renderFooter();
    return null;
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ── */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white overflow-y-auto">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a]">
            <span className="text-sm font-bold text-white">G</span>
          </div>
          <span className="text-sm font-bold text-[#1a1a1a]">Galler Admin</span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {/* Dashboard */}
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${activeSection === "dashboard" ? "bg-orange-50 text-[var(--primary-orange)]" : "text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Dashboard
          </button>

          {/* Groups */}
          {sidebarGroups.map((group) => {
            const items =
              group.label === "Blog Posts"
                ? [
                    { id: "blog-posts-list", label: "All Posts" },
                    ...blogPosts.map((post) => ({
                      id: `blog-post-${post.id}`,
                      label:
                        post.title.length > 26
                          ? `${post.title.slice(0, 26)}…`
                          : post.title || "Untitled",
                    })),
                  ]
                : group.items;

            return (
            <div key={group.label} className="mt-2">
              <button
                onClick={() => setSidebarOpen((prev) => ({ ...prev, [group.label]: !prev[group.label] }))}
                className="flex w-full items-center justify-between px-4 py-1.5 text-xs font-bold tracking-widest text-gray-400 uppercase hover:text-gray-600"
              >
                {group.label}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform ${sidebarOpen[group.label] ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              {sidebarOpen[group.label] && (
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${activeSection === item.id ? "bg-orange-50 font-semibold text-[var(--primary-orange)]" : "text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]"}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-gray-100 p-3">
          <Link href="/" className="mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
            View Website
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <h1 className="text-lg font-semibold text-[#1a1a1a]">Content Management</h1>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm font-medium text-green-600">Changes saved ✓</span>}
            {activeSection !== "dashboard" && activeSection !== "contact-submissions" && (
              <button onClick={handleSave} disabled={saving} className="rounded-xl bg-[var(--primary-orange)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b8451a] disabled:opacity-50">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f9f9f9]">{renderContent()}</main>
      </div>
    </div>
  );
}
