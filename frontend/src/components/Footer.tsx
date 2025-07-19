/**
 * @file Footer.tsx
 * @description Global footer displayed at bottom of every page.
 */

export default function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-gray-500 border-t mt-12">
      Built with ❤️ by Thapelo Magqazana • {new Date().getFullYear()}
    </footer>
  );
}
