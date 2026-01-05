import { Sun, Moon, Crown, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/useThemeStore";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";

const PreferencesForm = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [onlineStatus, setOnlineStatus] = useState(false);
  
  // Check if user has premium (replace with actual check from backend)
  const [isPremium, setIsPremium] = useState(false);

  const handleUpgradePremium = () => {
    navigate("/premium/checkout");
  };

  return (
    <div className="space-y-6">
      {/* Premium Card */}
      {!isPremium && (
        <Card className="border-2 border-primary/50 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />
          
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Crown className="h-6 w-6 text-amber-500" />
                  <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                    Lotus Premium
                  </span>
                </CardTitle>
                <CardDescription className="mt-2">
                  Nâng cấp trải nghiệm chat của bạn lên tầm cao mới
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white border-0">
                Mới
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <div className="grid gap-3">
              {[
                { icon: "🤖", text: "Trò chuyện không giới hạn với AI" },
                { icon: "🎨", text: "Tùy chỉnh giao diện cao cấp" },
                { icon: "☁️", text: "Lưu trữ file không giới hạn" },
                { icon: "🔒", text: "Mã hóa tin nhắn nâng cao" },
                { icon: "📞", text: "Cuộc gọi HD không giới hạn" },
                { icon: "✨", text: "Sticker & emoji độc quyền" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleUpgradePremium}
              className="w-full bg-gradient-to-r from-amber-500 via-pink-500 to-primary hover:opacity-90 transition-opacity text-white border-0 gap-2 text-base py-6"
            >
              <Crown className="h-5 w-5" />
              Nâng cấp Premium - 9.000đ/tháng
              <Sparkles className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Premium Status (if user has premium) */}
      {isPremium && (
        <Card className="border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-pink-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                Bạn đang dùng Premium
              </span>
            </CardTitle>
            <CardDescription>
              Cảm ơn bạn đã ủng hộ Lotus Chat! 💜
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Trạng thái</p>
                <p className="text-xs text-muted-foreground">Hoạt động đến 06/02/2026</p>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white border-0">
                Premium
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences Card */}
      <Card className="glass-strong border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Tuỳ chỉnh ứng dụng
          </CardTitle>
          <CardDescription>Cá nhân hoá trải nghiệm trò chuyện của bạn</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-toggle" className="text-base font-medium">
                Chế độ tối
              </Label>
              <p className="text-sm text-muted-foreground">
                Chuyển đổi giữa giao diện sáng và tối
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="theme-toggle"
                checked={isDark}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary-glow"
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Online Status */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="online-status" className="text-base font-medium">
                Hiển thị trạng thái online
              </Label>
              <p className="text-sm text-muted-foreground">
                Cho phép người khác thấy khi bạn đang online
              </p>
            </div>
            <Switch
              id="online-status"
              checked={onlineStatus}
              onCheckedChange={setOnlineStatus}
              className="data-[state=checked]:bg-primary-glow"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesForm;