"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./addProfileForm.module.css";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s) =>
  String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");

export default function AddProfile({ existingProfile = {}}) {
  const router = useRouter();
  const nameRef = useRef(null);
  const [values, setValues] = useState({
    name: existingProfile.name || "",
    title: existingProfile.title || "",
    email: existingProfile.email || "",
    bio: existingProfile.bio || "",
    img: null,
    img_url: existingProfile.image_url || "",
  });
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { name, title, email, bio, img, img_url } = values;
  const isEditMode = !!existingProfile.id;
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      const file = files[0];
      if (file && file.size < 1024 * 1024) {
        // 1MB limit
        setValues((prev) => ({ ...prev, img: files[0] }));
	setErrors("");
      } else {
        setErrors("Image size should be less than 1MB");
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors("");
    }
  };
    const successMessage = isEditMode ? "Profile updated successfully!" : "Profile added successfully!";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors("");

    try {
      const formData = new FormData();
      formData.append("name", stripTags(trimCollapse(name)));
      formData.append("title", stripTags(trimCollapse(title)));
      formData.append("email", stripTags(trimCollapse(email)));
      formData.append("bio", stripTags(bio).trim());
      if (img) {
        formData.append("img", img);
      }
      if (isEditMode) {
        formData.append("image_url", img_url);
      }
      const method = isEditMode ? "PUT" : "POST";
      console.log(existingProfile)
      const endpoint = isEditMode ? `/api/profiles/${existingProfile.id}` : "/api/profiles";

      const response = await fetch(endpoint, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      setSuccess(successMessage);
      setValues({
        name: "",
        title: "",
        email: "",
        bio: "",
        img: null,
        img_url: "",  
      });

      // Reset file input
      const fileInput = document.getElementById("img");
      if (fileInput) fileInput.value = "";

      setTimeout(() => {
        setSuccess("");
        router.push("/");
      }, 2000);
    } catch (error) {
      setErrors(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
            <form onSubmit={handleSubmit} className={styles["add-profile"]}>
              <label htmlFor="name">Name:</label>
              <input
                ref={nameRef}
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={onChange}
              />
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={onChange}
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={onChange}
              />
              <label htmlFor="bio">Bio:</label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Add Bio..."
                required
                value={bio}
                onChange={onChange}
              ></textarea>
              <label htmlFor="img">Image:</label>
              <input
                type="file"
                name="img"
                id="img"
                required={!isEditMode}
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={onChange}
              />
              {isEditMode && img_url && (
                <div className={styles["current-image"]}>
                  <p>Current Image:</p> 
                  <img src={img_url} alt="Current Profile Image" />
                </div>
              )}
              {errors && <p className={styles.errorMessage}>{errors}</p>}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !stripTags(trimCollapse(name)) ||
                  !stripTags(trimCollapse(title)) ||
                  !stripTags(trimCollapse(email)) ||
                  !stripTags(bio).trim() ||
                  (!img && !isEditMode)
                }
              >
                {isEditMode ? "Update Profile" : "Add Profile"}   
              </button>
              {success && <p className={styles.successMessage}>{success}</p>}
            </form>
  );
}