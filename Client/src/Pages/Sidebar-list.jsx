const SidebarData = [
  {
    menu: "Voucher Menu",
    operations: [
      { name: "ListVoucher", path: "/home/listvoucher" }
      
    ],
    reports: [
      { name: "Summary", path: "/app/vouchersummary" },
      { name: "SummaryDate", path: "/app/summarybydate" },
      { name: "Monthly", path: "/app/summarybymonth" },
      { name: "Datewise", path: "/app/datewise" },
    ],
  },
  {
    menu: "Misil Menu",
    operations: [],
    reports: [{ name: "Search", path: "/app/misilsearch" }],
  },
  {
    menu: "Kitta Menu",
    operations: [],
    reports: [
      { name: "Search", path: "/app/kittasearch" },
      { name: "Logout", path: "/logout" },
    ],
  },
];

export default SidebarData;
