import ChangePassword from '@components/change-password/ChangePassword';
import ProfileChange from '@components/profile-change/ProfileChange';
import Card from '@components/tailus-ui/Card';
import { Caption, List, Title } from '@components/tailus-ui/typography';

function ProfilePage() {
  return (
    <div className="space-y-8">
      <Card variant="outlined" className="rounded-xl grid grid-cols-1 md:grid-cols-[1fr,1fr] divide-x-0 md:divide-x-2 gap-8 bg-zinc-50">
        <div className="space-y-2">
          <Title>Đổi mật khẩu</Title>
          <Caption>Để đảm bảo an toàn tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</Caption>
          <Caption>Mật khẩu mới cần:</Caption>
          <List size="sm" className="text-caption">
            <li>Ít nhất 8 ký tự</li>
            <li>Bao gồm chữ và số</li>
            <li>Không trùng với mật khẩu cũ</li>
          </List>
        </div>
        <div className="px-0 md:px-8">
          <ChangePassword />
        </div>
      </Card>
      <Card variant="outlined" className="rounded-xl grid grid-cols-1 md:grid-cols-[1fr,1fr] divide-x-0 md:divide-x-2 gap-8 bg-zinc-50">
        <div className="space-y-2">
          <Title>Đổi thông tin cá nhân</Title>
          <Caption>Thay đổi thông tin cá nhân của bạn</Caption>
        </div>
        <div className="px-0 md:px-8">
          <ProfileChange />
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;
