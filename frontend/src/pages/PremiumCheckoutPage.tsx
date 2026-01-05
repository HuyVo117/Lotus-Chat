import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowLeft, Check, Clock, Shield } from "lucide-react";
import { toast } from "sonner";

const PremiumCheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      price: "9.000đ",
      duration: "1 tháng",
      total: 9000,
    },
    yearly: {
      price: "999.000đ",
      duration: "1 năm",
      total: 999000,
      discount: "Tiết kiệm 189.000đ",
    },
  };

  const handlePayment = () => {
    setShowQR(true);
    toast.info("Vui lòng quét mã QR để thanh toán");
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    // Simulate API call to verify payment
    setTimeout(() => {
      toast.success("Thanh toán thành công! Chào mừng bạn đến Premium 🎉");
      navigate("/");
    }, 1500);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Crown className="h-10 w-10 text-amber-500" />
              <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                Nâng cấp Premium
              </span>
            </h1>
            <p className="text-muted-foreground">
              Chọn gói phù hợp với bạn
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Plan Selection */}
          <div className="space-y-6">
            {/* Monthly Plan */}
            <Card
              className={`cursor-pointer transition-all ${
                selectedPlan === "monthly"
                  ? "border-2 border-primary shadow-lg shadow-primary/20"
                  : "border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gói tháng</CardTitle>
                  {selectedPlan === "monthly" && (
                    <Badge className="bg-primary">Đang chọn</Badge>
                  )}
                </div>
                <CardDescription>Linh hoạt, hủy bất cứ lúc nào</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  9.000đ
                  <span className="text-base font-normal text-muted-foreground">
                    /tháng
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    "AI không giới hạn",
                    "Cuộc gọi HD",
                    "Lưu trữ 10GB",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card
              className={`cursor-pointer transition-all relative overflow-hidden ${
                selectedPlan === "yearly"
                  ? "border-2 border-amber-500 shadow-lg shadow-amber-500/20"
                  : "border hover:border-amber-500/50"
              }`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-pink-500 text-white border-0">
                Tiết kiệm 16%
              </Badge>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gói năm</CardTitle>
                  {selectedPlan === "yearly" && (
                    <Badge className="bg-amber-500">Đang chọn</Badge>
                  )}
                </div>
                <CardDescription>Tốt nhất cho sử dụng lâu dài</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  999.000đ
                  <span className="text-base font-normal text-muted-foreground">
                    /năm
                  </span>
                </div>
                <p className="text-sm text-green-500 mb-4">
                  Chỉ 83.250đ/tháng • Tiết kiệm 189.000đ
                </p>
                <div className="space-y-2">
                  {[
                    "Tất cả tính năng gói tháng",
                    "Lưu trữ không giới hạn",
                    "Sticker độc quyền",
                    "Hỗ trợ ưu tiên",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Note */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 text-sm">
                  <Shield className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Thanh toán an toàn</p>
                    <p className="text-muted-foreground">
                      Giao dịch được mã hóa và bảo mật tuyệt đối
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Thanh toán</CardTitle>
                <CardDescription>
                  Quét mã QR để hoàn tất thanh toán
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!showQR ? (
                  <>
                    {/* Order Summary */}
                    <div className="space-y-3 pb-4 border-b">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gói đã chọn</span>
                        <span className="font-medium">
                          {selectedPlan === "monthly" ? "Tháng" : "Năm"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thời gian</span>
                        <span className="font-medium">
                          {plans[selectedPlan].duration}
                        </span>
                      </div>
                      {selectedPlan === "yearly" && (
                        <div className="flex justify-between text-green-500">
                          <span>Giảm giá</span>
                          <span className="font-medium">-189.000đ</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{plans[selectedPlan].price}</span>
                    </div>

                    {/* Payment Button */}
                    <Button
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-amber-500 via-pink-500 to-primary hover:opacity-90 transition-opacity text-white border-0 gap-2 py-6 text-base"
                    >
                      <Crown className="h-5 w-5" />
                      Thanh toán ngay
                    </Button>
                  </>
                ) : (
                  <>
                    {/* QR Code */}
                    <div className="text-center space-y-4">
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <img
                          src="/qr-payment.png"
                          alt="QR Payment"
                          className="w-64 h-64 mx-auto"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-medium">Quét mã QR để thanh toán</p>
                        <p className="text-sm text-muted-foreground">
                          Số tiền: <span className="font-bold text-primary">{plans[selectedPlan].price}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Nội dung: <span className="font-mono">LOTUS{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        </p>
                      </div>

                      {/* Checking Payment */}
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>Đang chờ thanh toán...</span>
                      </div>

                      {/* Confirm Payment Button */}
                      <Button
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                        className="w-full bg-green-500 hover:bg-green-600 text-white gap-2"
                      >
                        <Check className="h-5 w-5" />
                        {isProcessing ? "Đang xử lý..." : "Đã thanh toán"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setShowQR(false)}
                        className="w-full"
                        disabled={isProcessing}
                      >
                        Thay đổi gói
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCheckoutPage;