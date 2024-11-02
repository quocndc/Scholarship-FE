import { Text } from '@components/tailus-ui/typography';

function Footer() {
  return (
    <div className="w-full bg-soft-bg grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="col-span-2 md:col-span-1 flex gap-2 items-center">
        <img src="/images/logo.jpg" alt="Logo" className="size-28" />
        <Text weight="bold" className="">
          SFMS - Scholarship Finder Manager System
        </Text>
      </div>
    </div>
  );
}

export default Footer;
