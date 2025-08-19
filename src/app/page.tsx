'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/UserContext";
import { IUserData } from "@/types/login";
import { Eye, EyeOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from 'zod'




const formDataValidation = z.object({
  username: z.string()
    .min(1, { message: "Username field cannot be empty" }),
  password: z.string()
    .min(1, { message: "Password field cannot be empty" })
});

export default function Login() {
  const navigate = useRouter()
  const path = usePathname()
  const { userDetail, setUserDetail } = useUserContext()
  const [formData, setFormData] = useState<IUserData>({
    username: "",
    password: "",
  })
  const [isToggle, setToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const sizeValue = 18

  useEffect(() => {
    if (path === '/' && userDetail) {
      navigate.push('/dashboard');
    }
  }, [path, userDetail, navigate]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setFormData(prev => ({
      ...prev, [name]: value
    }))
  }



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const result = formDataValidation.safeParse(formData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().find(Boolean);
      toast.error(firstError, { duration: 1500 });
      setLoading(false)
      return
    }


    const isValidUser =
      (formData.username === "user1" && formData.password === "user1") ||
      (formData.username === "user2" && formData.password === "user2");

    if (!isValidUser) {
      toast.error("Invalid Credentials", { duration: 1500 });
      setLoading(false)
      return;
    }

    toast.success("Login Successful", { duration: 1500 });
    setUserDetail(formData);
    localStorage.setItem('user', JSON.stringify(formData))

    setTimeout(() => {
      setLoading(false);
      navigate.push("/dashboard");
    }, 500);
  }



  return (
    <div className="w-full min-h-screen p-8 flex justify-center items-center">
      <div className="w-fit h-fit p-6 border-gray-300 bg-white rounded-md -translate-y-1/2">
        <div className="text-center text-2xl font-semibold mb-4">Login</div>
        <form className="space-y-2 min-w-60" onSubmit={handleSubmit} >
          <div>
            <div className="text-gray-700 text-sm">
              Username
            </div>
            <div>
              <Input type="text" value={formData.username} name="username" placeholder="user1" onChange={handleChange} />
            </div>
          </div>
          <div>
            <div className="text-gray-700 text-sm">
              Password
            </div>
            <div className="relative">
              <Input type={isToggle ? "text" : "password"} name="password" value={formData.password} placeholder="user1" onChange={handleChange} />
              <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={() => setToggle(prev => !prev)}>{isToggle ? <EyeOff size={sizeValue} /> : <Eye size={sizeValue} />}</button>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled={loading}>Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
